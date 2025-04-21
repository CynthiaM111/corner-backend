const ModuleItem = require('../models/moduleItem');
const path = require('path');
const Module = require('../models/module');
const multer = require('multer');
// configure file storage



// create module item
const createModuleItem = async (req, res) => {
    try {
        const { moduleId, title, type, textContent, url } = req.body;

        // Verify the teacher owns the module
        const module = await Module.findOne({
            _id: moduleId,
            teacherId: req.user.userId
        });

        if (!module) {
            return res.status(403).json({ msg: 'Not authorized to add content to this module' });
        }

        // Get next position
        const lastItem = await ModuleItem.findOne({ moduleId })
            .sort({ position: -1 })
            .limit(1);
        const position = lastItem ? lastItem.position + 1 : 0;

        // Create item based on type
        let itemData = {
            title,
            type,
            moduleId,
            position,
            teacherId: req.user.userId
        };

        if (type === 'text') {
            itemData.content = { text: textContent };
        } else if (type === 'link') {
            itemData.content = { url };
        } else if (req.file) {
            itemData.file = {
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size,
                originalname: req.file.originalname
            };
        } else {
            return res.status(400).json({ msg: 'File is required for this content type' });
        }

        const newItem = new ModuleItem(itemData);
        await newItem.save();

        res.status(201).json(newItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// get all module items
const getModuleItems = async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);

        if (!module) {
            return res.status(404).json({ msg: 'Module not found' });
        }

        // Check permissions
        const isTeacher = module.teacherId.toString() === req.user.userId;
        const query = { moduleId: req.params.moduleId };

        if (!isTeacher) {
            query.isPublished = true;
        }

        const items = await ModuleItem.find(query)
            .sort({ position: 1 });

        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// update module item
const updateModuleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, textContent, url } = req.body;

        const item = await ModuleItem.findById(id);

        if (!item) {
            return res.status(404).json({ msg: 'Module item not found' });
        }

        // Check permissions
        const isTeacher = item.teacherId.toString() === req.user.userId;

        if (!isTeacher) {
            return res.status(403).json({ msg: 'Not authorized to update this item' });
        }

        // Update item
        item.title = title;
        item.type = type;
        item.content = type === 'link' ? { url } : { text: textContent };

        if (req.file) {
            item.file = {
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size,
                originalname: req.file.originalname
            };
        }

        await item.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// delete module item
const deleteModuleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ModuleItem.findById(id);

        if (!item) {
            return res.status(404).json({ msg: 'Module item not found' });
        }

        // Check permissions
        const isTeacher = item.teacherId.toString() === req.user.userId;

        if (!isTeacher) {
            return res.status(403).json({ msg: 'Not authorized to delete this item' });
        }

        await item.remove();

        res.json({ msg: 'Module item deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createModuleItem,
    getModuleItems,
    updateModuleItem,
    deleteModuleItem
};