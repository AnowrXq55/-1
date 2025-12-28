const fetch = require( node-fetch );

async function أمر_تحدي(سوك, معرف_الدردشة, رسالة) {
    try {
        const مفاتيح_شيزو =  shizo ;
        const استجابة = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${مفاتيح_شيزو}`);
        
        if (!استجابة.ok) {
            throw await استجابة.text();
        }
        
        const جيسون = await استجابة.json();
        const رسالة_التحدي = جيسون.result;

        // إرسال رسالة التحدي
        await سوك.sendMessage(معرف_الدردشة, { text: رسالة_التحدي }, { quoted: رسالة });
    } catch (خطأ) {
        console.error( خطأ في أمر التحدي: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, { text:  ❌ فشل في الحصول على تحدي. يرجى المحاولة مرة أخرى لاحقاً!  }, { quoted: رسالة });
    }
}

module.exports = { أمر_تحدي };