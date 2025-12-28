اسم الملف: aiCommand.js

محتوى الملف المحول:
const axios = require( axios );
const fetch = require( node-fetch );

async function أمر_الذكاء_الاصطناعي(سوك, معرف_الدردشة, رسالة) {
    try {
        const النص = رسالة.message?.conversation || رسالة.message?.extendedTextMessage?.text;
        
        if (!النص) {
            return await سوك.sendMessage(معرف_الدردشة, { 
                text: "يرجى تقديم سؤال بعد .gpt أو .gemini\n\nمثال: .gpt اكتب كود html أساسي"
            }, {
                quoted: رسالة
            });
        }

        // الحصول على الأمر والاستعلام
        const الأجزاء = النص.split(   );
        const الأمر = الأجزاء[0].toLowerCase();
        const الاستعلام = الأجزاء.slice(1).join(   ).trim();

        if (!الاستعلام) {
            return await سوك.sendMessage(معرف_الدردشة, { 
                text: "يرجى تقديم سؤال بعد .gpt أو .gemini"
            }, {quoted:رسالة});
        }

        try {
            // عرض رسالة المعالجة
            await سوك.sendMessage(معرف_الدردشة, {
                react: { text:  🤖 , key: رسالة.key }
            });

            if (الأمر ===  .gpt ) {
                // استدعاء واجهة برمجة تطبيقات GPT
                const الاستجابة = await axios.get(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(الاستعلام)}`);
                
                if (الاستجابة.data && الاستجابة.data.status && الاستجابة.data.result) {
                    const الإجابة = الاستجابة.data.result;
                    await سوك.sendMessage(معرف_الدردشة, {
                        text: الإجابة
                    }, {
                        quoted: رسالة
                    });
                    
                } else {
                    throw new Error( استجابة غير صالحة من واجهة برمجة التطبيقات );
                }
            } else if (الأمر ===  .gemini ) {
                const واجهات_البرمجة = [
                    `https://vapis.my.id/api/gemini?q=${encodeURIComponent(الاستعلام)}`,
                    `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(الاستعلام)}`,
                    `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(الاستعلام)}`,
                    `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(الاستعلام)}`,
                    `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(الاستعلام)}`,
                    `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(الاستعلام)}`
                ];

                for (const واجهة_برمجة of واجهات_البرمجة) {
                    try {
                        const الاستجابة = await fetch(واجهة_برمجة);
                        const البيانات = await الاستجابة.json();

                        if (البيانات.message || البيانات.data || البيانات.answer || البيانات.result) {
                            const الإجابة = البيانات.message || البيانات.data || البيانات.answer || البيانات.result;
                            await سوك.sendMessage(معرف_الدردشة, {
                                text: الإجابة
                            }, {
                                quoted: رسالة
                            });
                            
                            return;
                        }
                    } catch (خطأ) {
                        continue;
                    }
                }
                throw new Error( فشلت جميع واجهات برمجة تطبيقات Gemini );
            }
        } catch (خطأ) {
            console.error( خطأ في واجهة برمجة التطبيقات: , خطأ);
            await سوك.sendMessage(معرف_الدردشة, {
                text: "❌ فشل في الحصول على الرد. يرجى المحاولة مرة أخرى لاحقاً.",
                contextInfo: {
                    mentionedJid: [رسالة.key.participant || رسالة.key.remoteJid],
                    quotedMessage: رسالة.message
                }
            }, {
                quoted: رسالة
            });
        }
    } catch (خطأ) {
        console.error( خطأ في أمر الذكاء الاصطناعي: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, {
            text: "❌ حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.",
            contextInfo: {
                mentionedJid: [رسالة.key.participant || رسالة.key.remoteJid],
                quotedMessage: رسالة.message
            }
        }, {
            quoted: رسالة
        });
    }
}

module.exports = أمر_الذكاء_الاصطناعي;