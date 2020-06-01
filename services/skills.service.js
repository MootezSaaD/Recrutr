const { Skill } = require('../db/models');

function skillsService() {
    async function storeSkill(skill) {
        [skill, created] = await Skill.findOrCreate({
            where: { name: skill.name },
            defaults: {
                name: skill.name
            },
        });
        return skill;
    }

    async function storeSkills(skills) {
        let skillsArr = [];
        for (const skill of skills) {
            const result = await storeSkill(skill);
            skillsArr.push(result);
        }
        return skillsArr;
    }

    return { storeSkill, storeSkills };
}

module.exports = skillsService;
