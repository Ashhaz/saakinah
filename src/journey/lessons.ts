import type { Src } from '../types';
import { EXTRA_Q, MORE_LESSONS } from './lessons2';

/**
 * Journey curriculum. Rules for this file:
 *  - Only widely agreed basics of Islam. Anything scholars differ on is flagged, not decided.
 *  - Every lesson lists the Qur'an verses / hadith it rests on (`sources`) and each card that quotes one carries its own `ref`.
 *  - Quiz questions test only what the lesson's own cards just said. options[0] is the correct answer (shuffled at runtime).
 *  - English Qur'an wording is a translation of the meaning, not the Qur'an itself.
 */
export interface Card { h: string; body: string; ref?: Src[] }
export interface Q { q: string; options: [string, string, string]; why: string }
export interface Lesson { id: string; unit: number; title: string; icon: string; blurb: string; cards: Card[]; quiz: Q[]; sources: Src[] }
export const UNITS = [
  { title: 'Unit 1 · Who is Allah?', color: 215 },
  { title: 'Unit 2 · The pillars', color: 150 },
  { title: 'Unit 3 · Qur’an & Prophet', color: 45 },
  { title: 'Unit 4 · Good character', color: 330 },
  { title: 'Unit 5 · Coming back', color: 265 },
  { title: 'Unit 6 · The heart', color: 190 },
  { title: 'Unit 7 · Hardship & hope', color: 20 },
  { title: 'Unit 8 · The unseen', color: 280 },
  { title: 'Unit 9 · Daily life', color: 120 },
];

const BASE: Lesson[] = [
  {
    id: 'allah', unit: 0, title: 'Allah is One', icon: '☁', blurb: 'The heart of Islam in four short lines.',
    sources: [['quran', '112:1-4']],
    cards: [
      { h: 'Start with Allah', body: 'In Arabic, “Allah” is simply the name for God, the One who created everything. Islam begins with knowing Him and worshipping Him alone.' },
      { h: 'Four lines that sum it up', body: 'Sūrat al-Ikhlāṣ (Qur’an chapter 112) is short enough to learn in a minute. Its meaning: He is Allah, One. Allah is the Eternal Refuge (everyone needs Him; He needs no one). He neither begets nor was born. And there is none comparable to Him.', ref: [['quran', '112:1-4']] },
      { h: 'Why it matters', body: 'Believing that Allah is One is called tawḥīd. Everything else in Islam grows out of it.' },
    ],
    quiz: [
      { q: 'What does tawḥīd mean?', options: ['Believing that Allah is One', 'Fasting in Ramadan', 'Giving charity'], why: 'Tawḥīd is the belief that Allah is One.' },
      { q: 'Which chapter of the Qur’an sums up who Allah is in four short lines?', options: ['Al-Ikhlāṣ (112)', 'Al-Baqarah (2)', 'Yūsuf (12)'], why: 'Sūrat al-Ikhlāṣ is chapter 112.' },
      { q: 'According to Sūrat al-Ikhlāṣ, there is none ___ to Allah.', options: ['comparable', 'close', 'similar in name'], why: 'The last verse says there is none comparable to Him.' },
    ],
  },
  {
    id: 'purpose', unit: 0, title: 'Why are we here?', icon: '✧', blurb: 'Purpose, and life as a test.',
    sources: [['quran', '51:56'], ['quran', '67:2']],
    cards: [
      { h: 'A purpose', body: 'Allah says: “I did not create the jinn and mankind except to worship Me.” Worship in Islam is wider than prayer alone: it includes any good done with the intention of pleasing Allah.', ref: [['quran', '51:56']] },
      { h: 'Life is a test', body: 'Allah says that He created death and life to test which of us is best in deed. Hard days and easy days both carry a test: how will we respond?', ref: [['quran', '67:2']] },
      { h: 'Not a test you take alone', body: 'Allah is always near and always listening. You can turn to Him in any state, in any language.' },
    ],
    quiz: [
      { q: 'According to the Qur’an, why were humans created?', options: ['To worship Allah', 'To collect wealth', 'To compete with each other'], why: 'Qur’an 51:56.' },
      { q: 'Worship in Islam includes…', options: ['Any good done to please Allah, not only prayer', 'Only the five prayers', 'Only going to the masjid'], why: 'Worship is wider than ritual prayer alone.' },
      { q: 'Qur’an 67:2 says life and death were created to test…', options: ['which of us is best in deed', 'who is richest', 'who is the oldest'], why: 'The test is about our deeds.' },
    ],
  },
  {
    id: 'prophets', unit: 0, title: 'The Prophets', icon: '☾', blurb: 'Messengers to every people, ending with Muhammad ﷺ.',
    sources: [['quran', '16:36'], ['quran', '33:40']],
    cards: [
      { h: 'Guides for everyone', body: 'Allah says He sent a messenger to every nation, calling people to worship Allah alone. Muslims believe in all of them, such as Ibrāhīm, Mūsā and ʿĪsā (peace be upon them).', ref: [['quran', '16:36']] },
      { h: 'The last Messenger', body: 'Muḥammad ﷺ is the final Prophet. The Qur’an calls him the “Seal of the Prophets”. Muslims say “peace and blessings be upon him” (ṣallā Allāhu ʿalayhi wa sallam, written ﷺ) when his name is mentioned.', ref: [['quran', '33:40']] },
      { h: 'Humans, not gods', body: 'Prophets were human beings chosen to deliver Allah’s message. Worship is for Allah alone.' },
    ],
    quiz: [
      { q: 'Who is the final Prophet in Islam?', options: ['Muḥammad ﷺ', 'Mūsā (Moses)', 'Ibrāhīm (Abraham)'], why: 'Qur’an 33:40 calls him the Seal of the Prophets.' },
      { q: 'What does the Qur’an say about messengers?', options: ['One was sent to every nation', 'Only one was ever sent', 'They were angels'], why: 'Qur’an 16:36.' },
      { q: 'Prophets were…', options: ['human beings chosen to deliver Allah’s message', 'divine beings to be worshipped', 'kings who ruled the world'], why: 'Worship is for Allah alone.' },
    ],
  },
  {
    id: 'shahada', unit: 1, title: 'The five pillars', icon: '✺', blurb: 'The framework of a Muslim’s practice.',
    sources: [['bukhari', 8], ['muslim', 16]],
    cards: [
      { h: 'Islam is built on five', body: 'The Prophet ﷺ said that Islam is built on five: the testimony that none has the right to be worshipped except Allah and that Muḥammad is His Messenger, establishing the prayer, giving zakāt, Hajj to the House, and fasting Ramadan.', ref: [['bukhari', 8], ['muslim', 16]] },
      { h: 'The testimony: shahādah', body: 'Saying it sincerely is how a person enters Islam: “Ash-hadu an lā ilāha illā Allāh, wa ash-hadu anna Muḥammadan rasūlu Allāh.”' },
      { h: 'One step at a time', body: 'The next lessons look at each pillar slowly. You do not need to master all five today.' },
    ],
    quiz: [
      { q: 'How many pillars of Islam are there?', options: ['Five', 'Three', 'Seven'], why: 'The hadith says Islam is built on five.' },
      { q: 'Which of these is a pillar?', options: ['Fasting in Ramadan', 'Visiting a shrine', 'Learning Arabic grammar'], why: 'Fasting Ramadan is one of the five.' },
      { q: 'The first pillar is…', options: ['The testimony that none is worthy of worship but Allah and Muḥammad is His Messenger', 'Giving zakāt', 'Hajj'], why: 'This is the shahādah.' },
    ],
  },
  {
    id: 'iman', unit: 1, title: 'The six beliefs', icon: '❂', blurb: 'What a Muslim believes in.',
    sources: [['muslim', 8]],
    cards: [
      { h: 'The Angel Jibrīl’s questions', body: 'In a famous hadith, the angel Jibrīl came as a man and asked the Prophet ﷺ about faith. He ﷺ answered that faith is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in the divine decree (qadar), its good and its bad.', ref: [['muslim', 8]] },
      { h: 'In plain words', body: 'Allah; the angels; the revealed books (like the Qur’an); the messengers; the Day of Judgement; and that everything happens by Allah’s knowledge and will.' },
      { h: 'Qadar and effort', body: 'Believing in the decree does not mean sitting back. We still make plans and do our part, and we accept with patience what we cannot change.' },
    ],
    quiz: [
      { q: 'Who asked the Prophet ﷺ about faith in the famous hadith?', options: ['The angel Jibrīl', 'A king', 'A stranger who stayed hidden'], why: 'Jibrīl came in the form of a man (Muslim 8).' },
      { q: 'Which is one of the six beliefs?', options: ['The Last Day', 'Fate is pointless', 'Luck'], why: 'Belief in the Last Day is one of the six.' },
      { q: 'Believing in qadar means…', options: ['We do our part and accept what we cannot change', 'We stop trying', 'We blame others'], why: 'We act, then accept with patience.' },
    ],
  },
  {
    id: 'salah', unit: 1, title: 'Prayer (ṣalāh)', icon: '☪', blurb: 'Five times a day, a meeting with Allah.',
    sources: [['quran', '4:103'], ['bukhari', 528]],
    cards: [
      { h: 'Five times a day', body: 'Muslims pray five daily prayers: Fajr (dawn), Ẓuhr (midday), ʿAṣr (afternoon), Maghrib (sunset) and ʿIshāʾ (night). Allah says prayer is decreed upon the believers at specified times.', ref: [['quran', '4:103']] },
      { h: 'A river at your door', body: 'The Prophet ﷺ compared the five prayers to a river at one’s door in which a person bathes five times a day: no dirt would remain. By them Allah erases sins.', ref: [['bukhari', 528]] },
      { h: 'How to learn it', body: 'The exact steps of prayer are best learned from a teacher or your local masjid. Scholars have small differences in details, and that is normal. Prayer-time tools are in the Prayer times page.' },
    ],
    quiz: [
      { q: 'How many daily prayers are there?', options: ['Five', 'Three', 'Two'], why: 'Fajr, Ẓuhr, ʿAṣr, Maghrib, ʿIshāʾ.' },
      { q: 'Which prayer is at sunset?', options: ['Maghrib', 'Fajr', 'ʿAṣr'], why: 'Maghrib is right after sunset.' },
      { q: 'The Prophet ﷺ compared the five prayers to…', options: ['a river at one’s door to bathe in five times daily', 'a long journey', 'a heavy burden'], why: 'Bukhari 528.' },
    ],
  },
  {
    id: 'zakat', unit: 1, title: 'Zakāt: purifying wealth', icon: '❖', blurb: 'Sharing what Allah has given.',
    sources: [['quran', '2:43'], ['bukhari', 8]],
    cards: [
      { h: 'A duty tied to prayer', body: 'The Qur’an often mentions prayer and zakāt together: “establish prayer and give zakāt”. Zakāt means obligatory charity from savings once they reach a minimum amount (the niṣāb) for a year.', ref: [['quran', '2:43']] },
      { h: 'Who receives it', body: 'The Qur’an names who may receive zakāt, beginning with the poor and the needy (Qur’an 9:60). It is a right of those in need, not a favour.', ref: [['quran', '9:60']] },
      { h: 'Ask for the details', body: 'How much to give and exactly how to calculate depends on your wealth. Ask a trusted scholar or use a reliable zakāt guide. Voluntary charity (ṣadaqah) is encouraged at any time.' },
    ],
    quiz: [
      { q: 'Zakāt is…', options: ['Obligatory charity on savings above a minimum', 'A prayer', 'A pilgrimage'], why: 'It is the third pillar.' },
      { q: 'Who is first among those named for zakāt in 9:60?', options: ['The poor and the needy', 'The wealthy', 'Tourists'], why: 'Qur’an 9:60 begins with the poor and the needy.' },
      { q: 'Optional charity at any time is called…', options: ['Ṣadaqah', 'Shahādah', 'Qiblah'], why: 'Ṣadaqah is voluntary charity.' },
    ],
  },
  {
    id: 'sawm', unit: 1, title: 'Fasting in Ramadan', icon: '☽', blurb: 'A month of taqwā.',
    sources: [['quran', '2:183'], ['quran', '2:185']],
    cards: [
      { h: 'Prescribed for us', body: 'Allah says: “O you who believe, fasting is prescribed for you as it was prescribed for those before you, that you may become mindful of Allah (taqwā).”', ref: [['quran', '2:183']] },
      { h: 'The month of the Qur’an', body: 'Ramadan is the month in which the Qur’an was revealed. Muslims fast from dawn to sunset: no food, drink or intimate relations, and they increase prayer, Qur’an and kindness.', ref: [['quran', '2:185']] },
      { h: 'Ease is part of it', body: 'The same verse (2:185) says Allah intends ease for you, not hardship. Those who are sick or travelling have allowances, and details of making up days are best asked of a scholar.' },
    ],
    quiz: [
      { q: 'The goal of fasting in 2:183 is…', options: ['taqwā (mindfulness of Allah)', 'losing weight', 'showing off'], why: 'That you may become mindful of Allah.' },
      { q: 'Which month do Muslims fast?', options: ['Ramadan', 'Muharram only', 'Rajab only'], why: 'Fasting Ramadan is a pillar.' },
      { q: 'Ramadan is connected to…', options: ['the revelation of the Qur’an', 'Hajj only', 'the new year'], why: 'Qur’an 2:185.' },
    ],
  },
  {
    id: 'hajj', unit: 1, title: 'Hajj: the pilgrimage', icon: '◈', blurb: 'Once in a lifetime, if able.',
    sources: [['quran', '3:97'], ['bukhari', 8]],
    cards: [
      { h: 'To the House', body: 'Hajj is the pilgrimage to the Kaʿbah in Makkah. Allah says it is a duty owed to Him by people who are able to find a way to it.', ref: [['quran', '3:97']] },
      { h: 'Only if able', body: 'Hajj is required once in a lifetime for those who are able, in health, in money and in safety. Someone who is not able is not blamed.' },
      { h: 'One of five', body: 'Together with the testimony, prayer, zakāt and fasting, Hajj completes the five pillars named by the Prophet ﷺ.', ref: [['bukhari', 8]] },
    ],
    quiz: [
      { q: 'Where is Hajj performed?', options: ['Makkah', 'Madinah only', 'Jerusalem'], why: 'The pilgrimage is to the Kaʿbah in Makkah.' },
      { q: 'Who must perform Hajj?', options: ['Those who are able', 'Everyone, no exceptions', 'Only scholars'], why: 'Qur’an 3:97.' },
      { q: 'Hajj is one of…', options: ['the five pillars of Islam', 'the six beliefs', 'the optional extras'], why: 'The Prophet ﷺ named it among the five pillars (Bukhari 8).' },
    ],
  },
  {
    id: 'quran', unit: 2, title: 'The Qur’an', icon: '❀', blurb: 'The words of Allah, preserved.',
    sources: [['quran', '96:1'], ['quran', '15:9'], ['bukhari', 5027]],
    cards: [
      { h: 'The first word', body: 'The first revelation to the Prophet ﷺ began with the command “Read” (Iqraʾ): “Read in the name of your Lord who created.”', ref: [['quran', '96:1']] },
      { h: 'Guarded by Allah', body: 'Allah says: “Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian.” Muslims believe the Qur’an is preserved.', ref: [['quran', '15:9']] },
      { h: 'Learn it, teach it', body: 'The Prophet ﷺ said: “The best of you are those who learn the Qur’an and teach it.” You can start with a few verses a day and a translation you understand.', ref: [['bukhari', 5027]] },
    ],
    quiz: [
      { q: 'The first revelation began with which word?', options: ['Read (Iqraʾ)', 'Pray', 'Fast'], why: 'Qur’an 96:1.' },
      { q: 'Who does 15:9 say will guard the Qur’an?', options: ['Allah', 'Kings', 'Scholars alone'], why: 'Allah says He will be its guardian.' },
      { q: 'The Prophet ﷺ said the best are those who…', options: ['learn the Qur’an and teach it', 'own the most books', 'speak the most'], why: 'Bukhari 5027.' },
    ],
  },
  {
    id: 'sunnah', unit: 2, title: 'The Prophet as example', icon: '✦', blurb: 'A life to learn from.',
    sources: [['quran', '33:21'], ['quran', '68:4']],
    cards: [
      { h: 'An excellent example', body: 'Allah says: “You have in the Messenger of Allah an excellent example for whoever hopes for Allah and the Last Day and remembers Allah often.”', ref: [['quran', '33:21']] },
      { h: 'Great character', body: 'Allah says to him: “And indeed, you are of a great moral character.” His kindness, honesty and patience are part of what Muslims learn from.', ref: [['quran', '68:4']] },
      { h: 'What is “Sunnah”?', body: 'The Sunnah is the teaching and example of the Prophet ﷺ, recorded in hadith. Hadith collections like Ṣaḥīḥ al-Bukhārī and Ṣaḥīḥ Muslim are among the most trusted.' },
    ],
    quiz: [
      { q: 'What does 33:21 call the Messenger of Allah?', options: ['An excellent example', 'A king', 'A hidden saint'], why: 'He is an excellent example.' },
      { q: 'The “Sunnah” is…', options: ['the teaching and example of the Prophet ﷺ', 'a month', 'a type of prayer mat'], why: 'The Prophet’s teachings and example.' },
      { q: 'Two of the most trusted hadith collections are…', options: ['Bukhārī and Muslim', 'Poetry and proverbs', 'Newspapers'], why: 'Ṣaḥīḥ al-Bukhārī and Ṣaḥīḥ Muslim.' },
    ],
  },
  {
    id: 'purity', unit: 3, title: 'Cleanliness & wuḍūʾ', icon: '❍', blurb: 'Ready for prayer.',
    sources: [['quran', '5:6'], ['muslim', 223]],
    cards: [
      { h: 'Half of faith', body: 'The Prophet ﷺ said: “Purification is half of faith.”', ref: [['muslim', 223]] },
      { h: 'Wuḍūʾ (ablution)', body: 'Before prayer, a Muslim does wuḍūʾ. The Qur’an mentions washing the face and the hands up to the elbows, wiping the head, and washing the feet.', ref: [['quran', '5:6']] },
      { h: 'Learn it with someone', body: 'The details are easy to learn by watching a teacher or a trusted video. Different schools have small differences, and all are respected.' },
    ],
    quiz: [
      { q: 'Purification is…', options: ['half of faith', 'optional', 'only for Hajj'], why: 'Muslim 223.' },
      { q: 'Wuḍūʾ is done before…', options: ['prayer', 'fasting', 'eating'], why: 'It prepares for prayer.' },
      { q: 'Which is mentioned in 5:6?', options: ['Washing the face and hands', 'Fasting a day', 'Reading Arabic'], why: 'Qur’an 5:6 lists the washing of the face, hands and feet.' },
    ],
  },
  {
    id: 'parents', unit: 3, title: 'Kindness to parents', icon: '♡', blurb: 'Next to worship of Allah.',
    sources: [['quran', '17:23'], ['bukhari', 527]],
    cards: [
      { h: 'Do not even say “uff”', body: 'Allah commands us to worship Him alone and to be good to parents. If they reach old age with you, do not say to them even “uff” and do not shout at them, but speak to them with honourable words.', ref: [['quran', '17:23']] },
      { h: 'Beloved to Allah', body: 'Ibn Masʿūd asked the Prophet ﷺ which deed is most beloved to Allah. He said: prayer at its proper time. Then: kindness to parents.', ref: [['bukhari', 527]] },
      { h: 'Even when it’s hard', body: 'Kindness may be hard when there is conflict. Start small: a kind word, a call, a help at home.' },
    ],
    quiz: [
      { q: 'Allah says not to say even ___ to parents.', options: ['“uff”', '“no”', '“wait”'], why: 'Qur’an 17:23.' },
      { q: 'What did the Prophet ﷺ say comes right after prayer on time?', options: ['Kindness to parents', 'Wealth', 'Travel'], why: 'Bukhari 527.' },
      { q: 'A good way to start being kind is…', options: ['a small kind word or help', 'waiting for the perfect moment', 'ignoring them'], why: 'Small steps count.' },
    ],
  },
  {
    id: 'speech', unit: 3, title: 'Speak good or be silent', icon: '❝', blurb: 'The power of words.',
    sources: [['bukhari', 6018], ['muslim', 47]],
    cards: [
      { h: 'A rule for tongues', body: 'The Prophet ﷺ said: “Whoever believes in Allah and the Last Day, let him speak good or keep silent.”', ref: [['bukhari', 6018], ['muslim', 47]] },
      { h: 'Why it matters', body: 'Words can heal or hurt. This hadith ties good speech to faith itself.' },
      { h: 'Try today', body: 'Before sending a message, pause: is it true, is it kind, is it needed? If not, silence is also a good choice.' },
    ],
    quiz: [
      { q: 'The hadith says to speak good or…', options: ['keep silent', 'shout', 'leave'], why: 'Speak good or keep silent.' },
      { q: 'This is tied to…', options: ['belief in Allah and the Last Day', 'wealth', 'age'], why: 'The hadith begins with faith.' },
      { q: 'A good question before sending a message is…', options: ['Is it true, kind, and needed?', 'Will it go viral?', 'Who will be angry?'], why: 'Pause and check.' },
    ],
  },
  {
    id: 'brother', unit: 3, title: 'Love for others', icon: '✿', blurb: 'What you love for yourself.',
    sources: [['bukhari', 13], ['muslim', 45]],
    cards: [
      { h: 'A mark of faith', body: 'The Prophet ﷺ said: “None of you truly believes until he loves for his brother what he loves for himself.”', ref: [['bukhari', 13], ['muslim', 45]] },
      { h: 'Against envy', body: 'It means wishing people good, not envy. When you notice yourself comparing, you can make a quiet du’a for them.' },
      { h: 'Small acts', body: 'A smile, a message, sharing notes or food. Love shows in small, steady actions.' },
    ],
    quiz: [
      { q: 'Who should we love what we love for ourselves?', options: ['His brother in faith', 'Only his family', 'Only the rich'], why: 'The hadith speaks of loving for your brother what you love for yourself.' },
      { q: 'This helps against…', options: ['envy', 'prayer', 'fasting'], why: 'It points the heart to wishing good for others.' },
      { q: 'A small act of love is…', options: ['a kind message', 'ignoring them', 'copying them'], why: 'Small acts count.' },
    ],
  },
  {
    id: 'shukr', unit: 3, title: 'Gratitude & patience', icon: '☀', blurb: 'Two doors to peace.',
    sources: [['quran', '14:7'], ['muslim', 2999]],
    cards: [
      { h: 'Gratitude', body: 'Allah says: “If you are grateful, I will surely increase you.”', ref: [['quran', '14:7']] },
      { h: 'Both states are good', body: 'The Prophet ﷺ said the believer’s affair is all good: if something good happens he is grateful, and if something harmful happens he is patient, and both are good for him.', ref: [['muslim', 2999]] },
      { h: 'Try today', body: 'Name three blessings before you sleep. Patience does not mean pretending you are not hurt; it means turning to Allah while you are.' },
    ],
    quiz: [
      { q: 'What does Allah promise to the grateful in 14:7?', options: ['He will increase them', 'Nothing', 'A test only'], why: 'He will surely increase them.' },
      { q: 'According to the hadith, how is the believer’s affair?', options: ['All good', 'Always easy', 'Always hard'], why: 'Muslim 2999.' },
      { q: 'Patience means…', options: ['turning to Allah while you hurt', 'pretending to feel nothing', 'giving up'], why: 'It is not pretending.' },
    ],
  },
  {
    id: 'tawbah', unit: 4, title: 'Coming back: tawbah', icon: '↺', blurb: 'The door is always open.',
    sources: [['quran', '39:53'], ['quran', '66:8']],
    cards: [
      { h: 'Never despair', body: 'Allah says: “Say, ‘O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.’”', ref: [['quran', '39:53']] },
      { h: 'Sincere repentance', body: 'Allah calls the believers to repent with sincere repentance (66:8). Scholars explain it as stopping the wrong, feeling regret, and resolving not to return, and returning any right owed to people.', ref: [['quran', '66:8']] },
      { h: 'Start now', body: 'There is no waiting list. Say “Astaghfirullāh” and take one small step.' },
    ],
    quiz: [
      { q: 'What does 39:53 say not to do?', options: ['Despair of Allah’s mercy', 'Pray', 'Fast'], why: 'Do not despair of the mercy of Allah.' },
      { q: 'Tawbah means…', options: ['sincerely returning to Allah', 'hiding mistakes', 'blaming others'], why: 'Sincere repentance.' },
      { q: 'Scholars explain repentance as stopping, regretting, and…', options: ['resolving not to return', 'forgetting', 'waiting'], why: 'The third part is the resolve.' },
    ],
  },
  {
    id: 'dhikr', unit: 4, title: 'Remembering Allah', icon: '✶', blurb: 'The heart finds peace.',
    sources: [['quran', '13:28'], ['bukhari', 6407]],
    cards: [
      { h: 'Peace for hearts', body: 'Allah says: “Truly, in the remembrance of Allah do hearts find peace.”', ref: [['quran', '13:28']] },
      { h: 'Alive or not', body: 'The Prophet ﷺ compared the one who remembers his Lord to the one who does not, like the living and the dead.', ref: [['bukhari', 6407]] },
      { h: 'Start small', body: 'Say “SubḥānAllāh” (glory to Allah), “Alḥamdulillāh” (praise to Allah) and “Allāhu akbar” (Allah is greatest), anywhere, anytime.' },
    ],
    quiz: [
      { q: 'What brings peace to hearts according to 13:28?', options: ['Remembering Allah', 'Money', 'Followers'], why: 'In remembrance of Allah do hearts find peace.' },
      { q: 'What did the Prophet ﷺ compare the one who remembers with?', options: ['The living and the dead', 'A king and a servant', 'A sun and moon'], why: 'Bukhari 6407.' },
      { q: '“Alḥamdulillāh” means…', options: ['Praise be to Allah', 'Allah is greatest', 'Glory to Allah'], why: 'Alḥamdulillāh is praise to Allah.' },
    ],
  },
  {
    id: 'tawakkul', unit: 4, title: 'Trust in Allah', icon: '⚓', blurb: 'Do your part, then rely on Him.',
    sources: [['quran', '65:3'], ['quran', '3:159']],
    cards: [
      { h: 'Enough for him', body: 'Allah says: “And whoever relies upon Allah, He is sufficient for him.”', ref: [['quran', '65:3']] },
      { h: 'Decide, then rely', body: 'Allah says: “And when you have decided, then rely upon Allah.” We think, plan and act, and then trust the outcome to Him.', ref: [['quran', '3:159']] },
      { h: 'A calmer heart', body: 'Tawakkul does not remove effort. It removes the panic about what is not in your hands.' },
    ],
    quiz: [
      { q: 'Tawakkul means…', options: ['doing your part, then relying on Allah', 'doing nothing', 'worrying more'], why: 'Decide, then rely.' },
      { q: 'What does 65:3 say about the one who relies upon Allah?', options: ['He is sufficient for him', 'He will be tested more', 'He will not need work'], why: 'Allah is sufficient for him.' },
      { q: 'Tawakkul removes…', options: ['the panic about what is not in your hands', 'all effort', 'all prayer'], why: 'It brings calm.' },
    ],
  },
];

// Original lessons get extra questions; new lessons are appended so earlier progress stays valid.
export const LESSONS: Lesson[] = [
  ...BASE.map((l) => ({ ...l, quiz: [...l.quiz, ...(EXTRA_Q[l.id] ?? [])] })),
  ...MORE_LESSONS,
];
