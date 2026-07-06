const { db } = require('../db/db');
const { flowappProjects, flowappGenerations, flowappTemplates } = require('../db/schema');
const { canCreateProject, getUserSubscription, getPlanLimits } = require('../services/subscription');
const { generateFlowAppProject } = require('../services/ai');
const { eq, and, isNull } = require('drizzle-orm');

// 1. Get Project List
async function listProjects(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;

    try {
        const projects = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            );
        res.json(projects);
    } catch (error) {
        console.error('Error listing projects:', error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
}

// 2. Create Project
async function createProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { name, category, theme, description } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name is required' });

    try {
        // Enforce project limits
        const allowed = await canCreateProject(userId);
        if (!allowed) {
            return res.status(403).json({
                error: 'Project limit reached',
                message: 'Your current subscription plan limit has been reached. Please upgrade to create more projects.'
            });
        }

        const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`;

        // Get user subscription tier
        const sub = await getUserSubscription(userId, 'flowapp');
        const planType = sub ? sub.planId.replace('flowapp-', '') : 'lite';

        const newProject = {
            id: projectId,
            userId,
            name,
            slug,
            description: description || '',
            category: category || 'General',
            theme: theme || 'modern',
            status: 'draft',
            planType,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.insert(flowappProjects).values(newProject);
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
}

// 3. Get Single Project
async function getProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { id } = req.params;

    try {
        const results = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.id, id),
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            )
            .limit(1);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found or unauthorized' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Error getting project:', error);
        res.status(500).json({ error: 'Failed to retrieve project details' });
    }
}

// 4. Update Project (Save Code / Metadata)
async function updateProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { id } = req.params;
    const { name, gasUrl, backendCode, frontendCode, readme, description } = req.body;

    try {
        // Confirm ownership
        const existing = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.id, id),
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            )
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updateData = {
            updatedAt: new Date()
        };

        if (name !== undefined) updateData.name = name;
        if (gasUrl !== undefined) updateData.gasUrl = gasUrl;
        if (backendCode !== undefined) updateData.backendCode = backendCode;
        if (frontendCode !== undefined) updateData.frontendCode = frontendCode;
        if (readme !== undefined) updateData.readme = readme;
        if (description !== undefined) updateData.description = description;

        await db.update(flowappProjects)
            .set(updateData)
            .where(eq(flowappProjects.id, id));

        res.json({ success: true, message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
}

// 5. Delete Project
async function deleteProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { id } = req.params;

    try {
        const existing = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.id, id),
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            )
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Soft delete
        await db.update(flowappProjects)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(flowappProjects.id, id));

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
}

// 6. Generate Project Code (AI Trigger)
async function generateProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { id } = req.params;
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let project;
    try {
        const existing = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.id, id),
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            )
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        project = existing[0];
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve project metadata' });
    }

    const genId = `gen_${Date.now()}`;
    try {
        // Call AI generation service
        const aiOutput = await generateFlowAppProject(prompt, {
            category: project.category,
            theme: project.theme,
            planType: project.planType
        });

        // Save generated output to database
        await db.update(flowappProjects)
            .set({
                backendCode: aiOutput.backendCode,
                frontendCode: aiOutput.frontendCode,
                readme: aiOutput.readme,
                generatedPrompt: prompt,
                updatedAt: new Date()
            })
            .where(eq(flowappProjects.id, id));

        // Log successful generation
        await db.insert(flowappGenerations).values({
            id: genId,
            userId,
            projectId: id,
            prompt,
            model: 'gemini-1.5-pro',
            status: 'success',
            createdAt: new Date()
        });

        res.json({
            success: true,
            backendCode: aiOutput.backendCode,
            frontendCode: aiOutput.frontendCode,
            readme: aiOutput.readme
        });
    } catch (error) {
        // Log generation failure without affecting user quota limits
        await db.insert(flowappGenerations).values({
            id: genId,
            userId,
            projectId: id,
            prompt,
            model: 'gemini-1.5-pro',
            status: 'failed',
            errorMessage: error.message,
            createdAt: new Date()
        });

        console.error('Error generating project code:', error);
        res.status(500).json({ error: error.message || 'AI Generation timed out or failed. Please try again.' });
    }
}

// 7. Publish Project
async function publishProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { id } = req.params;
    const { slug } = req.body;

    if (!slug) return res.status(400).json({ error: 'Custom slug is required to publish.' });

    try {
        // Validate ownership
        const existing = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.id, id),
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            )
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const project = existing[0];

        // Ensure slug is unique (excluding this project)
        const slugConflict = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.slug, slug),
                    eq(flowappProjects.id, id) // wait, not this project:
                )
            );
            
        // Correct query: select from projects where slug = target and id != currentId
        const conflictingProjects = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.slug, slug),
                    // wait, not equal: eq is not what we want. In drizzle, we can import notEq
                )
            );
        
        // Let's filter in JS or use query
        const allWithSlug = await db.select().from(flowappProjects).where(eq(flowappProjects.slug, slug));
        const hasConflict = allWithSlug.some(p => p.id !== id && !p.deletedAt);

        if (hasConflict) {
            return res.status(400).json({ error: 'Slug is already in use by another project.' });
        }

        // Get plan limits to enforce FlowStack branding
        const sub = await getUserSubscription(userId, 'flowapp');
        const limits = getPlanLimits(sub ? sub.planId : 'free');

        // Compile Published HTML
        let finalHtml = project.frontendCode || '';
        
        // Inject Google Apps Script URL if available
        if (project.gasUrl) {
            finalHtml = finalHtml.replace('// GAS_URL_PLACEHOLDER', `const GAS_URL = "${project.gasUrl}";`);
            finalHtml = finalHtml.replace('var GAS_URL = "";', `var GAS_URL = "${project.gasUrl}";`);
            finalHtml = finalHtml.replace('const GAS_URL = "";', `const GAS_URL = "${project.gasUrl}";`);
        }

        // Handle Branding Injection
        if (!limits.canRemoveBranding) {
            const brandingBanner = `
            <!-- FlowStack Branding Banner -->
            <div id="fs-branding-banner" style="position: fixed; bottom: 0; right: 0; background: rgba(26, 26, 26, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-top-left-radius: 12px; font-family: sans-serif; font-size: 12px; color: #fff; z-index: 999999; display: flex; align-items: center; gap: 8px; box-shadow: 0 -4px 20px rgba(0,0,0,0.3);">
                <span>Built with</span>
                <a href="https://www.flowsstack.com/product/flowapp" target="_blank" style="color: #a78bfa; font-weight: bold; text-decoration: none;">FlowApp</a>
            </div>
            `;
            if (finalHtml.includes('</body>')) {
                finalHtml = finalHtml.replace('</body>', `${brandingBanner}</body>`);
            } else {
                finalHtml += brandingBanner;
            }
        }

        await db.update(flowappProjects)
            .set({
                slug,
                publishedHtml: finalHtml,
                isPublished: true,
                status: 'published',
                publishedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(flowappProjects.id, id));

        res.json({ success: true, message: 'App published successfully!', url: `/p/${slug}` });
    } catch (error) {
        console.error('Publishing error:', error);
        res.status(500).json({ error: 'Failed to publish project' });
    }
}

// 8. Export Project files as ZIP (mocked base64 or direct JSON format)
async function exportProject(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    const userId = req.user.uid;
    const { id } = req.params;

    try {
        // Enforce export limits
        const sub = await getUserSubscription(userId, 'flowapp');
        const limits = getPlanLimits(sub ? sub.planId : 'free');

        if (!limits.canExport) {
            return res.status(403).json({ error: 'Export ZIP is not supported on your current subscription plan. Please upgrade to Pro or Cloud.' });
        }

        const existing = await db.select()
            .from(flowappProjects)
            .where(
                and(
                    eq(flowappProjects.id, id),
                    eq(flowappProjects.userId, userId),
                    isNull(flowappProjects.deletedAt)
                )
            )
            .limit(1);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = existing[0];

        // For MVP, we send a JSON representation of files. 
        // We also offer setting standard headers so that the client downloads it directly.
        res.json({
            success: true,
            projectName: project.name,
            files: [
                { name: 'Code.gs', content: project.backendCode || '' },
                { name: 'index.html', content: project.frontendCode || '' },
                { name: 'README.md', content: project.readme || '' }
            ]
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export project' });
    }
}

// 9. Load Templates
async function loadTemplates(req, res) {
    if (!db) return res.status(500).json({ error: 'Database connection failed' });
    try {
        const templates = await db.select().from(flowappTemplates);
        res.json(templates);
    } catch (error) {
        console.error('Error loading templates:', error);
        res.status(500).json({ error: 'Failed to load templates' });
    }
}

module.exports = {
    listProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    generateProject,
    publishProject,
    exportProject,
    loadTemplates
};
