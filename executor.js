async function execute(code, language, input) {
    const langMap = {
        cpp:        'cpp',
        python:     'python',
        javascript: 'javascript',
        java:       'java',
        typescript: 'typescript',
        rust:       'rust',
        go:         'go',
    };

    const lang = langMap[language] || 'cpp';

    try {
        const res = await fetch(`https://glot.io/api/run/${lang}/latest`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${process.env.GLOT_TOKEN}`
            },
            body: JSON.stringify({
                files: [{ name: getFilename(language), content: code }],
                stdin: input || ''
            })
        });

        const data = await res.json();
        console.log('Glot response:', JSON.stringify(data, null, 2));

        if (data.error) return { error: data.error };
        if (data.stderr) return { error: data.stderr };
        return { output: data.stdout || 'No output' };

    } catch (err) {
        return { error: 'Execution failed: ' + err.message };
    }
}

function getFilename(language) {
    const names = {
        cpp: 'main.cpp', python: 'main.py', javascript: 'main.js',
        java: 'Main.java', typescript: 'main.ts', rust: 'main.rs', go: 'main.go'
    };
    return names[language] || 'main.cpp';
}

module.exports = { execute };