اسم الملف: banCommand.js

محتوى الملف المحول:
const fs = require( fs );
const { معلومات_القناة } = require( ../lib/messageConfig );
const مدير = require( ../lib/isAdmin );
const { سودو } = require( ../lib/index );

async function أمر_حظر(سوك, معرف_الدردشة, رسالة) {
    // تقييد في المجموعات للمدراء؛ في الخاص للمالك/سودو
    const مجموعة = معرف_الدردشة.endsWith( @g.us );
    if (مجموعة) {
        const معرف_المرسل = رسالة.key.participant || رسالة.key.remoteJid;
        const { مرسل_مدير, بوت_مدير } = await مدير(سوك, معرف_الدردشة, معرف_المرسل);
        if (!بوت_مدير) {
            await سوك.sendMessage(معرف_الدردشة, { text:  يرجى جعل البوت مديراً لاستخدام .ban , ...معلومات_القناة }, { quoted: رسالة });
            return;
        }
        if (!مرسل_مدير && !رسالة.key.fromMe) {
            await سوك.sendMessage(معرف_الدردشة, { text:  فقط مدراء المجموعة يمكنهم استخدام .ban , ...معلومات_القناة }, { quoted: رسالة });
            return;
        }
    } else {
        const معرف_المرسل = رسالة.key.participant || رسالة.key.remoteJid;
        const مرسل_سودو = await سودو(معرف_المرسل);
        if (!رسالة.key.fromMe && !مرسل_سودو) {
            await سوك.sendMessage(معرف_الدردشة, { text:  فقط المالك/سودو يمكنهم استخدام .ban في الدردشة الخاصة , ...معلومات_القناة }, { quoted: رسالة });
            return;
        }
    }
    let مستخدم_للحظر;
    
    // التحقق من المستخدمين المذكورين
    if (رسالة.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        مستخدم_للحظر = رسالة.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // التحقق من الرسالة التي تم الرد عليها
    else if (رسالة.message?.extendedTextMessage?.contextInfo?.participant) {
        مستخدم_للحظر = رسالة.message.extendedTextMessage.contextInfo.participant;
    }
    
    if (!مستخدم_للحظر) {
        await سوك.sendMessage(معرف_الدردشة, { 
            text:  يرجى ذكر المستخدم أو الرد على رسالته للحظر! , 
            ...معلومات_القناة 
        });
        return;
    }

    // منع حظر البوت نفسه
    try {
        const معرف_البوت = سوك.user.id.split( : )[0] +  @s.whatsapp.net ;
        if (مستخدم_للحظر === معرف_البوت || مستخدم_للحظر === معرف_البوت.replace( @s.whatsapp.net ,  @lid )) {
            await سوك.sendMessage(معرف_الدردشة, { text:  لا يمكنك حظر حساب البوت. , ...معلومات_القناة }, { quoted: رسالة });
            return;
        }
    } catch {}

    try {
        // إضافة المستخدم إلى قائمة المحظورين
        const المستخدمون_المحظورون = JSON.parse(fs.readFileSync( ./data/banned.json ));
        if (!المستخدمون_المحظورون.includes(مستخدم_للحظر)) {
            المستخدمون_المحظورون.push(مستخدم_للحظر);
            fs.writeFileSync( ./data/banned.json , JSON.stringify(المستخدمون_المحظورون, null, 2));
            
            await سوك.sendMessage(معرف_الدردشة, { 
                text: `تم حظر @${مستخدم_للحظر.split( @ )[0]} بنجاح!`,
                mentions: [مستخدم_للحظر],
                ...معلومات_القناة 
            });
        } else {
            await سوك.sendMessage(معرف_الدردشة, { 
                text: `${مستخدم_للحظر.split( @ )[0]} محظور بالفعل!`,
                mentions: [مستخدم_للحظر],
                ...معلومات_القناة 
            });
        }
    } catch (خطأ) {
        console.error( خطأ في أمر الحظر: , خطأ);
        await سوك.sendMessage(معرف_الدردشة, { text:  فشل في حظر المستخدم! , ...معلومات_القناة });
    }
}

module.exports = أمر_حظر;