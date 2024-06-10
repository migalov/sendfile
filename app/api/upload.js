import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

const handler = async (req, res) => {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 1024 * 1024 * 1024, // 1GB limit
  });

  form.on('fileBegin', (name, file) => {
    file.path = path.join(uploadDir, file.name);
  });

  form.on('file', (name, file) => {
    console.log(`Uploaded ${name}:`, file);
  });

  form.on('error', (err) => {
    console.error('Error occurred during file upload:', err);
    res.status(500).send({ error: 'Error occurred during file upload' });
  });

  req.setTimeout(600000, () => { // 10 minutes timeout
    console.log('Request timed out');
    res.status(408).send({ error: 'Request timed out' });
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error while parsing the files' });
      return;
    }
    res.status(200).json({ files });
  });
};

export default handler;
