const axios = require( axios );

module.exports = async function (سوك, معرف_الدردشة, رسالة) {
    try {
        const استجابة = await axios.get( https://uselessfacts.jsph.pl/random.json?language=en );
        const حقيقة = استجابة.data.text;
        await سوك.sendMessage(معرف_الدردشة, { text: حقيقة },{ quoted: رسالة });
    } catch (خطأ) {
        console.error( خطأ في جلب الحقيقة: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, { text:  عذراً، لم أستطع جلب حقيقة الآن.  },{ quoted: رسالة });
    }
};