const User = require('../models/User');
const Project = require('../models/Project')

exports.getProjects = async (req, res) => {
    try{
        const projects = await Project.find().populate('user')
        res.status(200).json(projects)
    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message})
    }
}

exports.createProject = async (req, res) => {
    try{
        const uploadedFile = req.file;
        const filePath = uploadedFile
            ? '/uploads/' + uploadedFile.filename
            : '';

        const newProject = new Project({ 
            user: req.body.user,
            title: req.body.title, 
            description: req.body.description, 
            image: filePath, 
            codeSnippet: req.body.codeSnippet, 
            link: req.body.link
        })
        const savedProject = await newProject.save();
        const savedProjectId = savedProject._id;
        const user = await User.findById(req.body.user);

        if(!user) {
            return res.status(404).json({ message: 'User not found'})
        }
        user.projects.push(savedProjectId);
        await user.save();

        res.status(200).json({
            message: 'Project successfully created',
            newProject: savedProject
        }) 
     
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.getProjectById = async (req, res) => {
    
        try {
            const project = await Project.findOne({ _id: req.params.projectId }).populate('user');
            if (!project) return res.status(404).json({ message: "Project not found" });
            res.json(project);
        } catch(error) {
            console.error('Error getting project', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    
}