import type { Lesson, Q } from './lessons';

/** Two extra questions for each original lesson (each only tests what that lesson's cards already say). */
export const EXTRA_Q: Record<string, Q[]> = {
  allah: [
    { q: 'In Arabic, what is “Allah”?', options: ['The name for God, the One who created everything', 'The name of a prophet', 'The name of an angel'], why: 'Allah is the Arabic name for God.' },
    { q: 'In Sūrat al-Ikhlāṣ, Allah is described as…', options: ['The Eternal Refuge', 'One of many gods', 'Born into a family'], why: '112:2: Allah is the Eternal Refuge.' },
  ],
  purpose: [
    { q: 'Which verse says humans were created to worship Allah?', options: ['51:56', '112:1', '33:40'], why: 'Qur’an 51:56.' },
    { q: 'How near is Allah, according to the lesson?', options: ['Always near and always listening', 'Far away', 'Only near inside the masjid'], why: 'You can turn to Him in any state, in any language.' },
  ],
  prophets: [
    { q: 'What do Muslims say when the Prophet’s name is mentioned?', options: ['Ṣallā Allāhu ʿalayhi wa sallam (ﷺ)', 'Nothing at all', 'Only “Allāhu akbar”'], why: 'Peace and blessings be upon him.' },
    { q: 'Which of these was a prophet mentioned in the lesson?', options: ['Mūsā (Moses)', 'Plato', 'Julius Caesar'], why: 'Ibrāhīm, Mūsā and ʿĪsā were named.' },
  ],
  shahada: [
    { q: 'Saying the shahādah sincerely is how a person…', options: ['enters Islam', 'finishes Ramadan', 'completes Hajj'], why: 'It is the testimony of faith.' },
    { q: 'Who named the five pillars in the hadith?', options: ['The Prophet ﷺ', 'A king', 'A later scholar'], why: 'Bukhari 8 / Muslim 16 report his words.' },
  ],
  iman: [
    { q: 'How many beliefs does the Jibrīl hadith list?', options: ['Six', 'Three', 'Ten'], why: 'Allah, angels, books, messengers, the Last Day, and the decree.' },
    { q: 'What does the hadith say about the divine decree?', options: ['Believe in it, its good and its bad', 'Ignore it', 'Believe only in the good part'], why: 'Believe in the decree, its good and its bad.' },
  ],
  salah: [
    { q: 'Which prayer is prayed at dawn?', options: ['Fajr', 'Ẓuhr', 'ʿIshāʾ'], why: 'Fajr is the dawn prayer.' },
    { q: 'The lesson says the exact steps of prayer are best learned from…', options: ['A teacher or your local masjid', 'Guessing', 'No one'], why: 'Scholars have small differences in details.' },
  ],
  zakat: [
    { q: 'Zakāt is due on savings once they reach…', options: ['the niṣāb, held for a year', 'any amount at all', 'a day in Ramadan only'], why: 'A minimum amount (niṣāb) for a year.' },
    { q: 'The Qur’an often mentions zakāt together with…', options: ['prayer', 'travel', 'poetry'], why: '“Establish prayer and give zakāt.”' },
  ],
  sawm: [
    { q: 'Each day in Ramadan, Muslims fast from…', options: ['dawn to sunset', 'sunrise to noon', 'sunset to dawn'], why: 'Dawn until sunset.' },
    { q: 'Verse 2:185 says Allah intends for you…', options: ['ease, not hardship', 'hardship, not ease', 'nothing at all'], why: 'Allah intends ease for you.' },
  ],
  hajj: [
    { q: 'Hajj is the pilgrimage to the…', options: ['Kaʿbah in Makkah', 'Mountains of Egypt', 'A mosque in Cairo'], why: 'The Kaʿbah in Makkah.' },
    { q: 'How often is Hajj required of those who are able?', options: ['Once in a lifetime', 'Every year', 'Every month'], why: 'Once in a lifetime if able.' },
  ],
  quran: [
    { q: 'Muslims believe the Qur’an is…', options: ['preserved by Allah', 'lost over time', 'written by scholars'], why: 'Qur’an 15:9: Allah is its guardian.' },
    { q: 'A good way to start is…', options: ['a few verses a day with a translation you understand', 'all 114 chapters at once', 'only after learning all Arabic grammar'], why: 'Start small.' },
  ],
  sunnah: [
    { q: 'Where is the Sunnah recorded?', options: ['In hadith collections', 'Only in poetry', 'Nowhere'], why: 'The Sunnah is recorded in hadith.' },
    { q: 'Verse 68:4 says the Prophet ﷺ was of…', options: ['great moral character', 'great wealth', 'great height'], why: 'You are of a great moral character.' },
  ],
  purity: [
    { q: 'Which does 5:6 mention washing?', options: ['The face, the hands to the elbows, and the feet', 'Only the feet', 'Nothing at all'], why: 'It also mentions wiping the head.' },
    { q: 'Different schools of thought have…', options: ['small differences in details, all respected', 'no differences at all', 'only one valid way'], why: 'Learn it from a teacher.' },
  ],
  parents: [
    { q: 'Verse 17:23 says to speak to parents with…', options: ['honourable words', 'silence only', 'raised voices'], why: 'Speak to them with honourable words.' },
    { q: 'In the hadith, which comes first?', options: ['Prayer at its proper time', 'Kindness to parents', 'Travel'], why: 'Prayer on time, then kindness to parents.' },
  ],
  speech: [
    { q: 'If a message is not kind or needed, silence is…', options: ['also a good choice', 'a sin', 'impossible'], why: 'Speak good or keep silent.' },
    { q: 'Words can…', options: ['heal or hurt', 'only hurt', 'never matter'], why: 'This is why the hadith ties speech to faith.' },
  ],
  brother: [
    { q: 'When you notice yourself comparing, you can…', options: ['make a quiet du’a for them', 'post about it', 'keep quiet and resent'], why: 'Wish them good.' },
    { q: 'Love shows in…', options: ['small, steady actions', 'big gifts only', 'words only'], why: 'A smile, a message, sharing.' },
  ],
  shukr: [
    { q: 'A simple practice before sleep is to…', options: ['name three blessings', 'count your mistakes', 'stay up late'], why: 'Name three blessings.' },
    { q: '“Alḥamdulillāh” is said to show…', options: ['gratitude', 'anger', 'pride'], why: 'It means all praise is for Allah.' },
  ],
  tawbah: [
    { q: 'Is there a waiting list for repentance?', options: ['No, you can start now', 'Yes, a year', 'Only in Ramadan'], why: 'There is no waiting list.' },
    { q: 'What can you say as a first step?', options: ['Astaghfirullāh (I seek Allah’s forgiveness)', 'Nothing', 'Only quote a book'], why: 'Say it and take one small step.' },
  ],
  dhikr: [
    { q: '“SubḥānAllāh” means…', options: ['Glory be to Allah', 'Allah is the Greatest', 'Praise be to Allah'], why: 'SubḥānAllāh: glory be to Allah.' },
    { q: '“Allāhu akbar” means…', options: ['Allah is the Greatest', 'Praise be to Allah', 'Glory be to Allah'], why: 'Allāhu akbar: Allah is the Greatest.' },
  ],
  tawakkul: [
    { q: 'Verse 3:159 says: when you have decided, then…', options: ['rely upon Allah', 'wait for others', 'ask no one'], why: 'Decide, then rely.' },
    { q: 'Tawakkul does not remove…', options: ['effort', 'trust', 'prayer'], why: 'We still plan and act.' },
  ],
};

export const MORE_LESSONS: Lesson[] = [
  // ── Unit 6: The heart ──
  {
    id: 'niyyah', unit: 5, title: 'Intentions', icon: '✎', blurb: 'Why the “why” matters.',
    sources: [['bukhari', 1], ['muslim', 1907]],
    cards: [
      { h: 'Actions by intentions', body: 'The Prophet ﷺ said: “Actions are only by intentions, and every person will have only what they intended.” (Narrated by ʿUmar.)', ref: [['bukhari', 1], ['muslim', 1907]] },
      { h: 'The same act, different meaning', body: 'The same action can mean different things depending on the intention. Studying, working and helping can become worship when they are done sincerely for Allah and within what He allows.' },
      { h: 'Renew it', body: 'Sincerity (ikhlāṣ) means doing it for Allah. You can renew your intention quietly in your heart before a task: “for You, Allah”.' },
    ],
    quiz: [
      { q: 'According to the hadith, actions are by…', options: ['intentions', 'appearances', 'speed'], why: 'Actions are only by intentions.' },
      { q: 'Who narrated this hadith?', options: ['ʿUmar', 'Jibrīl', 'A stranger'], why: 'Narrated by ʿUmar (Bukhari 1).' },
      { q: 'Sincerity (ikhlāṣ) means doing something…', options: ['for Allah', 'to be praised', 'to be first'], why: 'Sincerity is doing it for Allah.' },
      { q: 'Where do you renew your intention?', options: ['Quietly, in your heart', 'Only out loud in public', 'Only once a year'], why: 'It is an act of the heart.' },
    ],
  },
  {
    id: 'ihsan', unit: 5, title: 'Excellence: iḥsān', icon: '◇', blurb: 'Worship as if you see Him.',
    sources: [['muslim', 8]],
    cards: [
      { h: 'The third question', body: 'In the hadith of Jibrīl, after asking about Islam and faith, he asked about iḥsān. The Prophet ﷺ said: “It is to worship Allah as if you see Him, and if you do not see Him, then indeed He sees you.”', ref: [['muslim', 8]] },
      { h: 'What it means', body: 'Iḥsān means excellence and beauty in what we do: doing our best because Allah is aware of us.' },
      { h: 'In daily life', body: 'It can change small things: praying calmly, working honestly even when nobody checks, speaking kindly in private messages.' },
    ],
    quiz: [
      { q: 'Iḥsān means…', options: ['excellence in what we do', 'doing the bare minimum', 'avoiding people'], why: 'Excellence and beauty.' },
      { q: 'In the hadith, iḥsān is to worship Allah…', options: ['as if you see Him', 'only in the masjid', 'only alone'], why: 'And if you do not see Him, He sees you.' },
      { q: 'Who asked the Prophet ﷺ about iḥsān?', options: ['Jibrīl', 'A king', 'A neighbour'], why: 'Muslim 8.' },
      { q: 'Iḥsān can show in…', options: ['honest work when nobody checks', 'impressing others', 'staying silent about faith'], why: 'Allah sees.' },
    ],
  },
  {
    id: 'dua', unit: 5, title: 'Du’a: asking Allah', icon: '☄', blurb: 'He is near and He answers.',
    sources: [['quran', '2:186'], ['quran', '40:60']],
    cards: [
      { h: 'I am near', body: 'Allah says: “And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.”', ref: [['quran', '2:186']] },
      { h: 'Call upon Me', body: 'Allah says: “Call upon Me; I will respond to you.” Du’a (supplication) is how we speak to Allah directly.', ref: [['quran', '40:60']] },
      { h: 'Any language, any time', body: 'You may ask in your own words and your own language. There are also beautiful du’as taught by the Prophet ﷺ; you can find many on the Du’as page.' },
    ],
    quiz: [
      { q: 'What does 2:186 say about Allah?', options: ['He is near and responds', 'He is far away', 'He only answers scholars'], why: 'Indeed I am near.' },
      { q: 'Du’a means…', options: ['supplication (asking Allah)', 'fasting', 'travel'], why: 'It is asking Allah.' },
      { q: 'Verse 40:60 begins: “Call upon Me; I will…”', options: ['respond to you', 'ignore you', 'test you'], why: 'I will respond to you.' },
      { q: 'You may make du’a in…', options: ['your own words and language', 'Arabic only', 'a masjid only'], why: 'Any language, any time.' },
    ],
  },
  {
    id: 'ilm', unit: 5, title: 'Seeking knowledge', icon: '❒', blurb: 'Ask for more, step by step.',
    sources: [['quran', '20:114'], ['quran', '39:9']],
    cards: [
      { h: 'A short du’a', body: 'Allah teaches the Prophet ﷺ to say: “My Lord, increase me in knowledge.”', ref: [['quran', '20:114']] },
      { h: 'Not the same', body: 'Allah asks: “Are those who know equal to those who do not know?” Knowledge has value, and it is worth seeking.', ref: [['quran', '39:9']] },
      { h: 'Learn well', body: 'Start with the basics, ask teachers, and check the sources. This Journey is only a beginning.' },
    ],
    quiz: [
      { q: 'The du’a in 20:114 is…', options: ['“My Lord, increase me in knowledge”', '“Give me wealth”', '“Make me famous”'], why: 'Rabbi zidnī ʿilmā.' },
      { q: 'Verse 39:9 asks: are those who know equal to those who…', options: ['do not know', 'travel', 'fast'], why: 'Knowledge has value.' },
      { q: 'A good way to learn is to…', options: ['start with basics and ask teachers', 'only read comments online', 'skip the sources'], why: 'Check the sources.' },
      { q: 'This Journey is…', options: ['only a beginning', 'the end of learning', 'a replacement for teachers'], why: 'It is a start.' },
    ],
  },
  // ── Unit 7: Hardship & hope ──
  {
    id: 'sabr', unit: 6, title: 'Patience in hardship', icon: '⛰', blurb: 'Allah is with the patient.',
    sources: [['quran', '2:153'], ['quran', '2:155-156']],
    cards: [
      { h: 'Seek help', body: 'Allah says: “O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.”', ref: [['quran', '2:153']] },
      { h: 'We will be tried', body: 'Allah tells us we will be tested with some fear, hunger and loss. Those who are patient say: “Indeed we belong to Allah, and indeed to Him we will return.”', ref: [['quran', '2:155-156']] },
      { h: 'Not alone', body: 'Hard times do not mean Allah has left you. Pray, ask for help, and take the next small step.' },
    ],
    quiz: [
      { q: 'What two things does 2:153 say to seek help through?', options: ['Patience and prayer', 'Wealth and fame', 'Sleep and silence'], why: 'Patience and prayer.' },
      { q: 'Allah is…', options: ['with the patient', 'away from the patient', 'only with the rich'], why: 'Indeed, Allah is with the patient.' },
      { q: 'What do the patient say in 2:156?', options: ['“Indeed we belong to Allah, and to Him we return”', '“It is unfair”', 'Nothing'], why: 'Innā lillāhi wa innā ilayhi rājiʿūn.' },
      { q: 'Hard times mean…', options: ['you can still turn to Allah', 'Allah has left you', 'prayer is cancelled'], why: 'You are not alone.' },
    ],
  },
  {
    id: 'hijrah', unit: 6, title: 'The Cave and the Hijrah', icon: '⛺', blurb: '“Do not grieve; Allah is with us.”',
    sources: [['quran', '9:40']],
    cards: [
      { h: 'The migration', body: 'The Hijrah was the Prophet’s ﷺ migration from Makkah to Madinah. It was so important that the Islamic (Hijri) calendar counts from it.' },
      { h: 'In the cave', body: 'On the way, he ﷺ and his companion (Abū Bakr, as the scholars explain) hid in a cave. Allah tells us that he said to his companion: “Do not grieve; indeed Allah is with us.”', ref: [['quran', '9:40']] },
      { h: 'For us too', body: 'When you feel afraid or alone, you can remember these words and say them in your heart: Allah is with us.' },
    ],
    quiz: [
      { q: 'The Hijrah was a migration from…', options: ['Makkah to Madinah', 'Madinah to Makkah', 'Egypt to Syria'], why: 'Makkah to Madinah.' },
      { q: 'The Islamic (Hijri) calendar counts from…', options: ['the Hijrah', 'the birth of a king', 'Ramadan'], why: 'It begins with the Hijrah.' },
      { q: 'What did he ﷺ say in the cave?', options: ['“Do not grieve; indeed Allah is with us.”', '“Run away.”', 'Nothing'], why: 'Qur’an 9:40.' },
      { q: 'Who was his companion, as scholars explain?', options: ['Abū Bakr', 'A stranger', 'A king'], why: 'Abū Bakr aṣ-Ṣiddīq.' },
    ],
  },
  {
    id: 'qadr', unit: 6, title: 'Laylat al-Qadr', icon: '✨', blurb: 'The night better than a thousand months.',
    sources: [['quran', '97:1-3'], ['bukhari', 2017]],
    cards: [
      { h: 'The Night of Decree', body: 'Allah says: “Indeed, We sent it (the Qur’an) down during the Night of Decree.” And: “The Night of Decree is better than a thousand months.”', ref: [['quran', '97:1-3']] },
      { h: 'When to look for it', body: 'The Prophet ﷺ told us to look for it in the odd-numbered nights of the last ten nights of Ramadan.', ref: [['bukhari', 2017]] },
      { h: 'What to do', body: 'Pray, read the Qur’an, make du’a and ask forgiveness. Scholars differ about which exact night it is, which is why people try all of the last ten nights.' },
    ],
    quiz: [
      { q: 'The Night of Decree is better than…', options: ['a thousand months', 'a hundred days', 'a year'], why: 'Qur’an 97:3.' },
      { q: 'What was sent down during that night?', options: ['The Qur’an', 'The Kaʿbah', 'Zakāt'], why: 'Qur’an 97:1.' },
      { q: 'Where do we look for it?', options: ['The odd nights of the last ten of Ramadan', 'The first night of Shaʿbān', 'Any random night'], why: 'Bukhari 2017.' },
      { q: 'Scholars on the exact night…', options: ['differ, so we seek all of the last ten', 'all agree on one fixed date', 'say it does not exist'], why: 'We seek it in the last ten nights.' },
    ],
  },
  // ── Unit 8: The unseen ──
  {
    id: 'angels', unit: 7, title: 'The Angels', icon: '☁', blurb: 'Created from light.',
    sources: [['quran', '2:285'], ['muslim', 2996]],
    cards: [
      { h: 'We believe in them', body: 'Allah says the believers “all believed in Allah, His angels, His books and His messengers.” Belief in angels is one of the six beliefs.', ref: [['quran', '2:285']] },
      { h: 'Made from light', body: 'The Prophet ﷺ said: “The angels were created from light, the jinn were created from smokeless fire, and Adam was created from that which has been described to you.”', ref: [['muslim', 2996]] },
      { h: 'What we know', body: 'Angels worship Allah and carry out His commands. Jibrīl (Gabriel) brought revelation to the prophets. Beyond what the Qur’an and Sunnah tell us, we do not guess.' },
    ],
    quiz: [
      { q: 'What were angels created from?', options: ['Light', 'Smokeless fire', 'Clay'], why: 'Muslim 2996.' },
      { q: 'What were the jinn created from?', options: ['Smokeless fire', 'Light', 'Water'], why: 'Muslim 2996.' },
      { q: 'Belief in angels is…', options: ['one of the six beliefs', 'optional', 'a pillar of Islam'], why: 'It is among the six.' },
      { q: 'Which angel brought revelation?', options: ['Jibrīl', 'No angel', 'A prophet'], why: 'Jibrīl (Gabriel).' },
    ],
  },
  {
    id: 'names', unit: 7, title: 'Allah’s beautiful names', icon: '❋', blurb: 'The Most Merciful.',
    sources: [['quran', '7:180'], ['quran', '1:1-3']],
    cards: [
      { h: 'The best names', body: 'Allah says: “And to Allah belong the best names, so invoke Him by them.”', ref: [['quran', '7:180']] },
      { h: 'The Most Merciful', body: 'Almost every chapter of the Qur’an begins with “In the name of Allah, ar-Raḥmān (the Entirely Merciful), ar-Raḥīm (the Especially Merciful)”.', ref: [['quran', '1:1-3']] },
      { h: 'Call Him by them', body: 'When you ask, you can use a name that fits your need: “Yā Ghafūr” (O Forgiving), “Yā Razzāq” (O Provider), “Yā Laṭīf” (O Most Gentle).' },
    ],
    quiz: [
      { q: 'According to 7:180, Allah has…', options: ['the best names', 'no names', 'one name only'], why: 'To Allah belong the best names.' },
      { q: 'Ar-Raḥmān and ar-Raḥīm both relate to…', options: ['mercy', 'power over kings', 'travel'], why: 'Both mean merciful.' },
      { q: 'We should invoke Allah…', options: ['by His names', 'only silently', 'only in the masjid'], why: 'Invoke Him by them.' },
      { q: '“Ghafūr” means…', options: ['Forgiving', 'Strong', 'Hidden'], why: 'Al-Ghafūr: the Forgiving.' },
    ],
  },
  {
    id: 'akhirah', unit: 7, title: 'The Hereafter', icon: '⚖', blurb: 'Every atom’s weight counts.',
    sources: [['quran', '3:185'], ['quran', '99:7-8']],
    cards: [
      { h: 'Death is certain', body: 'Allah says: “Every soul will taste death. And you will only be given your full compensation on the Day of Resurrection.”', ref: [['quran', '3:185']] },
      { h: 'Nothing is lost', body: 'Allah says: “So whoever does an atom’s weight of good will see it, and whoever does an atom’s weight of evil will see it.”', ref: [['quran', '99:7-8']] },
      { h: 'Hope and care', body: 'Muslims live between hope in Allah’s mercy and care about their actions. Allah is the Most Merciful, so we keep trying and returning to Him.' },
    ],
    quiz: [
      { q: 'Every soul will…', options: ['taste death', 'live forever', 'avoid the test'], why: 'Qur’an 3:185.' },
      { q: 'According to 99:7-8, an atom’s weight of good…', options: ['will be seen', 'is forgotten', 'does not count'], why: 'It will be seen.' },
      { q: 'We will be given our full compensation on…', options: ['the Day of Resurrection', 'Fridays', 'the first of Ramadan'], why: 'Qur’an 3:185.' },
      { q: 'The lesson says Muslims live between…', options: ['hope in mercy and care about actions', 'fear only', 'carelessness'], why: 'Hope and care.' },
    ],
  },
  // ── Unit 9: Daily life ──
  {
    id: 'honesty', unit: 8, title: 'Honesty', icon: '✔', blurb: 'Truth leads to goodness.',
    sources: [['bukhari', 6094], ['muslim', 2607]],
    cards: [
      { h: 'Truth leads to goodness', body: 'The Prophet ﷺ said: “Truthfulness leads to righteousness, and righteousness leads to Paradise. A man keeps telling the truth until he is recorded with Allah as truthful (ṣiddīq).”', ref: [['bukhari', 6094], ['muslim', 2607]] },
      { h: 'And the opposite', body: 'In the same hadith, lying leads to wickedness, and wickedness leads to the Fire. A person who keeps lying is recorded as a liar.', ref: [['bukhari', 6094]] },
      { h: 'Try today', body: 'Tell the truth kindly, even when it is hard, and avoid exaggeration and small lies.' },
    ],
    quiz: [
      { q: 'According to the hadith, truthfulness leads to…', options: ['righteousness', 'embarrassment', 'poverty'], why: 'Righteousness, and then Paradise.' },
      { q: 'A man who keeps telling the truth is recorded as…', options: ['truthful (ṣiddīq)', 'a king', 'a traveller'], why: 'Recorded with Allah as truthful.' },
      { q: 'Lying leads to…', options: ['wickedness', 'popularity', 'peace'], why: 'Wickedness, then the Fire.' },
      { q: 'A good practice is to…', options: ['tell the truth kindly', 'exaggerate to impress', 'avoid all talking'], why: 'Truth, with kindness.' },
    ],
  },
  {
    id: 'neighbours', unit: 8, title: 'Neighbours & guests', icon: '⌂', blurb: 'Faith shows in how we treat others.',
    sources: [['bukhari', 6018], ['muslim', 47]],
    cards: [
      { h: 'Do not harm', body: 'The Prophet ﷺ said: “Whoever believes in Allah and the Last Day should not harm his neighbour.”', ref: [['bukhari', 6018], ['muslim', 47]] },
      { h: 'Honour your guest', body: 'In the same hadith: “Whoever believes in Allah and the Last Day should honour his guest.” Good manners are tied to faith.', ref: [['bukhari', 6018]] },
      { h: 'Small ways', body: 'Greet your neighbour, keep noise down at night, share food, and welcome visitors warmly.' },
    ],
    quiz: [
      { q: 'A believer should not…', options: ['harm his neighbour', 'greet his neighbour', 'share with his neighbour'], why: 'Do not harm your neighbour.' },
      { q: 'A believer should honour his…', options: ['guest', 'enemy', 'phone'], why: 'Honour the guest.' },
      { q: 'These are tied to…', options: ['belief in Allah and the Last Day', 'wealth', 'age'], why: 'The hadith begins with faith.' },
      { q: 'One small way to be a good neighbour is to…', options: ['keep noise down at night', 'ignore them', 'complain all the time'], why: 'Small acts count.' },
    ],
  },
  {
    id: 'sadaqah', unit: 8, title: 'Every good deed is charity', icon: '✿', blurb: 'Charity is bigger than money.',
    sources: [['muslim', 1005]],
    cards: [
      { h: 'Every good deed', body: 'The Prophet ﷺ said: “Every good deed is charity (ṣadaqah).”', ref: [['muslim', 1005]] },
      { h: 'More than money', body: 'This means kindness counts: a kind word, helping someone, removing harm from the road, or giving your time.' },
      { h: 'Start now', body: 'You do not need to be rich to give. Pick one small good deed today and do it for Allah.' },
    ],
    quiz: [
      { q: 'According to the hadith, every good deed is…', options: ['ṣadaqah (charity)', 'optional', 'a duty only for the rich'], why: 'Muslim 1005.' },
      { q: 'Charity can include…', options: ['a kind word', 'only money', 'only food'], why: 'Kindness counts.' },
      { q: 'Do you need to be rich to give?', options: ['No', 'Yes', 'Only in Ramadan'], why: 'Any good deed counts.' },
      { q: 'What should you do today?', options: ['One small good deed for Allah', 'Wait for a big opportunity', 'Nothing'], why: 'Start small.' },
    ],
  },
  {
    id: 'jumuah', unit: 8, title: 'Friday (Jumuʿah)', icon: '☪', blurb: 'The weekly gathering.',
    sources: [['quran', '62:9']],
    cards: [
      { h: 'The call', body: 'Allah says: “O you who have believed, when the call to prayer is made on the day of Friday, then proceed to the remembrance of Allah and leave trade.”', ref: [['quran', '62:9']] },
      { h: 'A weekly gathering', body: 'On Friday, Muslims gather for a sermon (khuṭbah) and a congregational prayer, which takes the place of the Ẓuhr prayer that day.' },
      { h: 'Ask who it is for', body: 'Who it is required for and the details are best asked of your teacher or masjid.' },
    ],
    quiz: [
      { q: 'What does Allah say to do when the Friday call is made?', options: ['Proceed to the remembrance of Allah', 'Continue trading', 'Stay at home'], why: 'Qur’an 62:9.' },
      { q: 'The Friday prayer comes with…', options: ['a sermon (khuṭbah)', 'no sermon', 'a fast'], why: 'A khuṭbah and the prayer.' },
      { q: 'On Friday, the congregational prayer takes the place of…', options: ['Ẓuhr', 'Fajr', 'Maghrib'], why: 'It replaces Ẓuhr that day.' },
      { q: 'For details about who must attend, ask…', options: ['a teacher or your masjid', 'nobody', 'a stranger online only'], why: 'Details are best asked of a teacher.' },
    ],
  },
];
