const { التعامل_مع_أمر_منع_الكلمات_البذيئة } = require( ../lib/antibadword );
const مساعد_المدير = require( ../lib/isAdmin );

async function أمر_منع_الكلمات_البذيئة(سوك, معرف_الدردشة, رسالة, معرف_المرسل, مرسل_مدير) {
    try {
        if (!مرسل_مدير) {
            await سوك.sendMessage(معرف_الدردشة, { text:  ```للمدراء فقط!```  }, { quoted: رسالة });
            return;
        }

        // استخراج المطابقة من الرسالة
        const النص = رسالة.message?.conversation || 
                    رسالة.message?.extendedTextMessage?.text ||   ;
        const المطابقة = النص.split(   ).slice(1).join(   );

        await التعامل_مع_أمر_منع_الكلمات_البذيئة(سوك, معرف_الدردشة, رسالة, المطابقة);
    } catch (خطأ) {
        console.error( خطأ في أمر منع الكلمات البذيئة: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, { text:  *خطأ في معالجة أمر منع الكلمات البذيئة*  }, { quoted: رسالة });
    }
}

module.exports = أمر_منع_الكلمات_البذيئة;