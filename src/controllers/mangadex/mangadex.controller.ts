import axios from 'axios';
import { Request, Response } from 'express';

export const getTrendingManga = async (req: Request, res: Response): Promise<void> => {
  try {
    const daysAgoParam = parseInt(req.query.daysAgo as string) || 30; // Default to 30 if not provided
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysAgoParam);
    const formattedDate = fromDate.toISOString().split('T')[0] + 'T00:00:00';

    const url = `https://api.mangadex.org/manga?limit=10&includedTagsMode=AND&excludedTagsMode=OR&availableTranslatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&createdAtSince=${formattedDate}&order%5BfollowedCount%5D=desc&hasAvailableChapters=true`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const getMangaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mangaId = req.params.id;
    const url = `https://api.mangadex.org/manga/${mangaId}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const getCoverArtByMangaId = async (req: Request, res: Response): Promise<void> => {
  try {
    const coverId = req.params.id;
    const url = `https://api.mangadex.org/cover/${coverId}?includes[]=manga`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const getChaptersByMangaId = async (req: Request, res: Response): Promise<void> => {
  try {
    const mangaId = req.params.id;
    const language = req.query.language as string;
    const url = `https://api.mangadex.org/manga/${mangaId}/aggregate?translatedLanguage[]=${language}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const getChapterDetailById = async (req: Request, res: Response): Promise<void> => {
  try {
    const chapterId = req.params.chapterId;
    const url = `https://api.mangadex.org/at-home/server/${chapterId}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const getChapterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const chapterId = req.params.chapterId;
    const url = `https://api.mangadex.org/chapter/${chapterId}?includes[]=manga`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
