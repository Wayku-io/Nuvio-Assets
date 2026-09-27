const fs = require('fs');

const jsonPath = './dist/nuvio-collections-profile-1-2026-09-26.json';
const data = require(jsonPath);

const mapping = {
  "Wizarding World": "wizarding-world",
  "DC": "dc-comics",
  "Marvel": "marvel",
  "Retour vers le futur": "retour-vers-le-futur",
  "Fast and Furious": "fast-and-furious",
  "Pixar": "pixar",
  "DreamWorks": "dreamworks",
  "Lucasfilm": "lucasfilm",
  "Hunger Games": "hunger-games",
  "The Walking Dead": "the-walking-dead",
  "Game of Thrones": "game-of-thrones",
  "Breaking bad": "breaking-bad"
};

const hasFocusGif = {
  "wizarding-world": true,
  "dc-comics": false,
  "marvel": true,
  "retour-vers-le-futur": true,
  "fast-and-furious": true,
  "pixar": false,
  "dreamworks": false,
  "lucasfilm": false,
  "hunger-games": true,
  "the-walking-dead": true,
  "game-of-thrones": true,
  "breaking-bad": true
};

const univCollection = data.find(c => c.id === 'collections-studios-community');
if (univCollection && univCollection.folders) {
  univCollection.folders.forEach(folder => {
    const key = mapping[folder.title];
    if (key) {
      const baseUrl = `https://cdn.jsdelivr.net/gh/Wayku-io/nuviowayku@main/dist/univers/${key}`;
      folder.coverImageUrl = `${baseUrl}/cover.webp`;
      folder.backdropUrl = `${baseUrl}/backdrop.webp`;
      folder.titleLogoUrl = `${baseUrl}/title.webp`;
      folder.focusGifUrl = `${baseUrl}/focus.${hasFocusGif[key] ? 'gif' : 'webp'}`;
    }
  });
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('JSON updated successfully.');
