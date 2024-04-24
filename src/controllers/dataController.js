const fs = require('fs');
const path = require('path');

const getCovers = (req, res) => {
    const backgroundsFolder = path.join(__dirname, '../../public/backgrounds');

    fs.readdir(backgroundsFolder, (err, files) => {
        if (err) {
            console.error('Error al leer archivos de backgrounds:', err);
            res.status(500).json({ error: 'Error al obtener backgrounds' });
        } else {          
            const jpgFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg');         
            const imagePaths = jpgFiles.map(file => `/public/backgrounds/${file}`);       
            res.json(imagePaths);
        }
    });
};

module.exports = { getCovers };

