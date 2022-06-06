const fs = require('fs').promises;
const zhConvertor = require('zhconvertor').default;

const generate = async () => {
    const levels = [1, 2, 3, 4, 5, 6];
    const resultAll = {};
    const resultDifferent = {};
    const tempDifferentTraditionalCharacters = [];
    const allDifferentTraditionalCharacters = [];
    const stats = [];
    let totalCharacters = 0;

    levels.forEach((level) => {
        const thisHskLevelAll = [];
        const thisHskLevelDifferent = [];

        const dataFile = require(`./data/hsk-${level}.json`);
        dataFile.forEach((character) => {
            totalCharacters++;
            const simplified = character.hanzi;
            const traditional = zhConvertor.s2t(simplified);
            const hanzi = {
                simplified,
                traditional,
                isTraditionalDifferent: simplified !== traditional
            };
            thisHskLevelAll.push(hanzi);
            if (hanzi.isTraditionalDifferent) {
                thisHskLevelDifferent.push(hanzi);
                tempDifferentTraditionalCharacters.push(hanzi.traditional);
                allDifferentTraditionalCharacters.push(hanzi.traditional);
            }
        });
        resultAll[level] = thisHskLevelAll;
        resultDifferent[level] = thisHskLevelDifferent;

        // Save a file with a list of only the characters
        fs.writeFile(`./out/hsk-${level}-different-traditional.txt`, tempDifferentTraditionalCharacters.join(' '));
        fs.writeFile(`./out/hsk-${level}-different-traditional-no-spaces.txt`, tempDifferentTraditionalCharacters.join(''));
        console.log(`List of all different traditional characters written in HSK ${level} -- total different characters: `, tempDifferentTraditionalCharacters.length);
        stats.push({
            level,
            totalCharacters: dataFile.length,
            totalDifferentTraditionalCharacters: tempDifferentTraditionalCharacters.length
        });
        tempDifferentTraditionalCharacters.length = 0;
    });

    // Save full data
    await fs.writeFile("./out/hsk-all.json", JSON.stringify(resultAll, null, 2));
    console.log('HSK list with all characters written');

    // Get only the characters different in traditional than simplified
    await fs.writeFile("./out/hsk-different-traditional.json", JSON.stringify(resultDifferent, null, 2));
    console.log('JSON HSK list with only different traditional characters written');

    // Write a stats file
    stats.push({
        level: 'all',
        totalCharacters,
        totalDifferentTraditionalCharacters: allDifferentTraditionalCharacters.length
    })
    await fs.writeFile("./out/hsk-traditional-stats.json", JSON.stringify(stats, null, 2));
    console.log('JSON HSK Traditional Character Statistics written');

    // Save a file with a list of only the characters (txt) full
    fs.writeFile(`./out/hsk-all-different-traditional.txt`, allDifferentTraditionalCharacters.join(' '));
    fs.writeFile(`./out/hsk-all-different-traditional-no-spaces.txt`, allDifferentTraditionalCharacters.join(''));
    console.log(`List of all different traditional characters written in HSK ALL -- total different characters: `, allDifferentTraditionalCharacters.length);
}

generate();