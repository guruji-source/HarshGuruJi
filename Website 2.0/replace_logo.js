const fs = require('fs');
const path = require('path');

const dir = 'c:\\\\Users\\\\Harsh\\\\Desktop\\\\Website 2.0';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newHtml = `<img src="logo.png" alt="HarshGuruJi Logo" style="height: 40px; width: auto; border-radius: 5px;" />`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Regex matches the span elements with optional whitespace/newlines between them
    content = content.replace(/<span class="logo-icon">✦<\/span>\s*<span class="logo-text">HarshGuruJi<\/span>/g, newHtml);
    fs.writeFileSync(filePath, content, 'utf8');
});

// Update EJS files in auth-backend
const authDir = path.join(dir, 'auth-backend', 'views');
if (fs.existsSync(authDir)) {
    const ejsFiles = fs.readdirSync(authDir).filter(f => f.endsWith('.ejs'));
    ejsFiles.forEach(file => {
        const filePath = path.join(authDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/<div class="logo"><span>Harsh<\/span>GuruJi<\/div>/g, `<div style="text-align: center;"><img src="/logo.png" alt="HarshGuruJi Logo" style="height: 60px; margin-bottom: 10px; border-radius: 5px;" /></div>`);
        content = content.replace(/<div class="logo" style="margin:0;"><span>Harsh<\/span>GuruJi Account<\/div>/g, `<img src="/logo.png" alt="HarshGuruJi Logo" style="height: 40px; border-radius: 5px;" />`);
        fs.writeFileSync(filePath, content, 'utf8');
    });
}

console.log('Replaced all logos successfully!');
