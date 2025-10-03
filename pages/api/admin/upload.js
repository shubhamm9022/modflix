import { connectToDB } from '../../../../lib/mongodb';
import axios from 'axios';
import { nanoid } from 'nanoid';

async function uploadToPlatform(apiKey, apiUrl, driveLink, title) {
  try {
    const resp = await axios.post(apiUrl, {
      key: apiKey,
      url: driveLink,
      title,
      public: 1,
    });
    return resp.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { title, driveLink } = req.body;
    if (!title || !driveLink) return res.status(400).json({ error: 'Missing title or driveLink' });

    const db = await connectToDB();
    const slug = nanoid(8);

    const [earnvidsResp, streamhgResp, filemoonResp] = await Promise.all([
      uploadToPlatform(process.env.EARNVIDS_API_KEY, process.env.EARNVIDS_API_URL, driveLink, title),
      uploadToPlatform(process.env.STREAMHG_API_KEY, process.env.STREAMHG_API_URL, driveLink, title),
      uploadToPlatform(process.env.FILEMOON_API_KEY, process.env.FILEMOON_API_URL, driveLink, title),
    ]);

    const movieData = {
      title,
      slug,
      driveLink,
      platforms: {
        earnvids: earnvidsResp?.result || null,
        streamhg: streamhgResp?.result || null,
        filemoon: filemoonResp?.result || null,
      },
      views: 0,
      uploaded_at: new Date(),
    };

    await db.collection('movies').insertOne(movieData);

    return res.status(200).json({ msg: 'Uploaded', movie: movieData, pageUrl: `${process.env.SITE_BASE_URL}/watch/${slug}` });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
