export class ProfileFakeDb
{
  public static timelineEn = {
        activities: [
            {
                'user'   : {
                    'name'  : 'Margaret Brown',
                    'avatar': 'assets/images/avatars/alice.jpg'
                },
                'message': 'has totalized 1400 pts',
                'time'   : '13 minutes ago'
            },
            {
                'user'   : {
                    'name'  : 'William Cooper',
                    'avatar': 'assets/images/avatars/andrew.jpg'
                },
                'message': 'has subscribed at laboratory',
                'time'   : '3 hours ago'
            },
            {
                'user'   : {
                    'name'  : 'Oscar Baker',
                    'avatar': 'assets/images/avatars/garry.jpg'
                },
                'message': 'has shared a document',
                'time'   : '9th November, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Oliver Scott',
                    'avatar': 'assets/images/avatars/carl.jpg'
                },
                'message': 'has totalized 1734 pts',
                'time'   : '6th November, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Lily Webb',
                    'avatar': 'assets/images/avatars/jane.jpg'
                },
                'message': 'has commented the post',
                'time'   : '6th November, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Luke Kelly',
                    'avatar': 'assets/images/avatars/james.jpg'
                },
                'message': 'has totalized 800 pts',
                'time'   : '1st November, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Charlotte Dixon',
                    'avatar': 'assets/images/avatars/joyce.jpg'
                },
                'message': 'has shared a document',
                'time'   : '21st October, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Joe Grey',
                    'avatar': 'assets/images/avatars/vincent.jpg'
                },
                'message': 'has commented the post',
                'time'   : '15th October, 2017'
            }
        ],
        posts     : [
            {
                'user'    : {
                    'name'  : 'Claudio Castiglione',
                    'avatar': 'assets/images/avatars/garry.jpg'
                },
                'message' : 'Hello everyone, we are organizing a new Lab. The theme will be Cyber Security, if you want to participate or you are interested in pursuing the subject subscrive or follows us! Stay tuned!',
                'time'    : '32 minutes ago',
                'type'    : 'post',
                'like'    : 5,
                'share'   : 21,
                'comments': [
                    {
                        'user'   : {
                            'name'  : 'Harry',
                            'avatar': 'assets/images/avatars/Trevino.jpg'
                        },
                        'time'   : '15 minutes ago',
                        'message': 'Thanks! I’ll be there'
                    }
                ]
            },
            {
                'user'    : {
                    'name'  : 'Guglielmo Siciliani',
                    'avatar': 'assets/images/avatars/andrew.jpg'
                },
                'message' : 'Hey! We urgently need someone that knows how to run the export of CRM. If you know how to do it or you can help us to identify who might know.. you’re the one we looking for!',
                'time'    : 'April 3, 2018',
                'type'    : 'article',
                'like'    : 9,
                'share'   : 6,
            }
        ]
    };

  public static timelineIt = {
        activities: [
            {
                'user'   : {
                    'name'  : 'Nella Cocci',
                    'avatar': 'assets/images/avatars/alice.jpg'
                },
                'message': 'ha realizzato 1400 p.ti',
                'time'   : '13 minuti fa'
            },
            {
                'user'   : {
                    'name'  : 'Guglielmo Siciliani',
                    'avatar': 'assets/images/avatars/andrew.jpg'
                },
                'message': 'si è iscritto al laboratorio',
                'time'   : '3 ore fa'
            },
            {
                'user'   : {
                    'name'  : 'Claudio Castiglione',
                    'avatar': 'assets/images/avatars/garry.jpg'
                },
                'message': 'ha condiviso un documento',
                'time'   : '9 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Viviano Lori',
                    'avatar': 'assets/images/avatars/carl.jpg'
                },
                'message': 'ha realizzato 1734 p.ti',
                'time'   : '6 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Antonina Trevisan',
                    'avatar': 'assets/images/avatars/jane.jpg'
                },
                'message': 'ha commentato il post',
                'time'   : '6 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Luca Padovesi',
                    'avatar': 'assets/images/avatars/james.jpg'
                },
                'message': 'ha fatto 800 p.ti',
                'time'   : '1 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Antonella Siciliano',
                    'avatar': 'assets/images/avatars/joyce.jpg'
                },
                'message': 'ha condiviso un documento',
                'time'   : '21 Ottobre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Andrea Trentini',
                    'avatar': 'assets/images/avatars/vincent.jpg'
                },
                'message': 'ha commentato un post',
                'time'   : '15 Ottobre, 2017'
            }
        ],
        posts     : [
            {
                'user'    : {
                    'name'  : 'Claudio Castiglione',
                    'avatar': 'assets/images/avatars/garry.jpg'
                },
                'message' : 'Ciao a tutti, stiamo organizzando un nuovo Laboratorio. Il tema sara la Cyber Security,' +
                            ' se vuoi partecipare o sei interessato ad approfondire la tematica iscriviti o seguici! Stay Tuned!',
                'time'    : '32 minutes ago',
                'type'    : 'post',
                'like'    : 5,
                'share'   : 21,
                'comments': [
                    {
                        'user'   : {
                            'name'  : 'Dino Davide',
                            'avatar': 'assets/images/avatars/Trevino.jpg'
                        },
                        'time'   : '15 minutes ago',
                        'message': 'Grazie, ci saró!'
                    }
                ]
            },
            {
                'user'    : {
                    'name'  : 'Guglielmo Siciliani',
                    'avatar': 'assets/images/avatars/andrew.jpg'
                },
                'message' : 'Hey!! Abbiamo bisogno urgentemete di qualcuno che sappia come funziona l\'export del CRM. ' +
                            'Se sai come fare o sai aiutarci ad individuare chi puó aiutarci... sei chi cerchiamo! :D',
                'time'    : 'April 3, 2018',
                'type'    : 'article',
                'like'    : 9,
                'share'   : 6,
            }
        ]
    };

    public static photosVideosIt = [
        {
            'name' : 'June 2015',
            'info' : '5 Photos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                }
            ]
        },
        {
            'name' : 'May 2015',
            'info' : '7 Photos, 3 Videos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                }
            ]
        },
        {
            'name' : 'April 2015',
            'info' : '5 Photos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                }
            ]
        }
    ];

    public static photosVideosEn = [
        {
            'name' : 'June 2015',
            'info' : '5 Photos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                }
            ]
        },
        {
            'name' : 'May 2015',
            'info' : '7 Photos, 3 Videos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                }
            ]
        },
        {
            'name' : 'April 2015',
            'info' : '5 Photos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                }
            ]
        }
    ];

    public static aboutEn = {
        'general': {
            'gender'   : 'Female',
            'birthday' : 'May 8th, 1988',
            'locations': [
                'Istanbul, Turkey',
                'New York, USA'
            ],
            'about'    : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget pharetra felis, sed ullamcorper dui. Sed et elementum neque. Vestibulum pellente viverra ultrices. Etiam justo augue, vehicula ac gravida a, interdum sit amet nisl. Integer vitae nisi id nibh dictum mollis in vitae tortor.'
        },
        'work'   : {
            'occupation': 'Developer',
            'skills'    : 'C#, PHP, Javascript, Angular, JS, HTML, CSS',
            'jobs'      : [
                {
                    'company': 'Self-Employed',
                    'date'   : '2010 - Now'
                },
                {
                    'company': 'Google',
                    'date'   : '2008 - 2010'
                }
            ]
        },
        'contact': {
            'address' : 'Ut pharetra luctus est quis sodales. Duis nisi tortor, bibendum eget tincidunt, aliquam ac elit. Mauris nec euismod odio.',
            'tel'     : [
                '+6 555 6600',
                '+9 555 5255'
            ],
            'websites': [
                'withinpixels.com'
            ],
            'emails'  : [
                'mail@withinpixels.com',
                'mail@creapond.com'
            ]
        },
        'groups' : [
            {
                'logo'    : 'assets/images/logos/android.png',
                'name'    : 'Android',
                'category': 'Technology',
                'members' : '1.856.546'
            },
            {
                'logo'    : 'assets/images/logos/google.png',
                'name'    : 'Google',
                'category': 'Web',
                'members' : '1.226.121'
            },
            {
                'logo'    : 'assets/images/logos/fallout.png',
                'name'    : 'Fallout',
                'category': 'Games',
                'members' : '526.142'
            }
        ],
        'friends': [
            {
                'name'  : 'Garry Newman',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            {
                'name'  : 'Carl Henderson',
                'avatar': 'assets/images/avatars/carl.jpg'
            },
            {
                'name'  : 'Jane Dean',
                'avatar': 'assets/images/avatars/jane.jpg'
            },
            {
                'name'  : 'Garry Arnold',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            {
                'name'  : 'Vincent Munoz',
                'avatar': 'assets/images/avatars/vincent.jpg'
            },
            {
                'name'  : 'Alice Freeman',
                'avatar': 'assets/images/avatars/alice.jpg'
            },
            {
                'name'  : 'Andrew Green',
                'avatar': 'assets/images/avatars/andrew.jpg'
            }
        ]
    };

    public static aboutIt = {
        'general': {
            'gender'   : 'Female',
            'birthday' : 'May 8th, 1988',
            'locations': [
                'Istanbul, Turkey',
                'New York, USA'
            ],
            'about'    : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget pharetra felis, sed ullamcorper dui. Sed et elementum neque. Vestibulum pellente viverra ultrices. Etiam justo augue, vehicula ac gravida a, interdum sit amet nisl. Integer vitae nisi id nibh dictum mollis in vitae tortor.'
        },
        'work'   : {
            'occupation': 'Developer',
            'skills'    : 'C#, PHP, Javascript, Angular, JS, HTML, CSS',
            'jobs'      : [
                {
                    'company': 'Self-Employed',
                    'date'   : '2010 - Now'
                },
                {
                    'company': 'Google',
                    'date'   : '2008 - 2010'
                }
            ]
        },
        'contact': {
            'address' : 'Ut pharetra luctus est quis sodales. Duis nisi tortor, bibendum eget tincidunt, aliquam ac elit. Mauris nec euismod odio.',
            'tel'     : [
                '+6 555 6600',
                '+9 555 5255'
            ],
            'websites': [
                'withinpixels.com'
            ],
            'emails'  : [
                'mail@withinpixels.com',
                'mail@creapond.com'
            ]
        },
        'groups' : [
            {
                'logo'    : 'assets/images/logos/android.png',
                'name'    : 'Android',
                'category': 'Technology',
                'members' : '1.856.546'
            },
            {
                'logo'    : 'assets/images/logos/google.png',
                'name'    : 'Google',
                'category': 'Web',
                'members' : '1.226.121'
            },
            {
                'logo'    : 'assets/images/logos/fallout.png',
                'name'    : 'Fallout',
                'category': 'Games',
                'members' : '526.142'
            }
        ],
        'friends': [
            {
                'name'  : 'Garry Newman',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            {
                'name'  : 'Carl Henderson',
                'avatar': 'assets/images/avatars/carl.jpg'
            },
            {
                'name'  : 'Jane Dean',
                'avatar': 'assets/images/avatars/jane.jpg'
            },
            {
                'name'  : 'Garry Arnold',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            {
                'name'  : 'Vincent Munoz',
                'avatar': 'assets/images/avatars/vincent.jpg'
            },
            {
                'name'  : 'Alice Freeman',
                'avatar': 'assets/images/avatars/alice.jpg'
            },
            {
                'name'  : 'Andrew Green',
                'avatar': 'assets/images/avatars/andrew.jpg'
            }
        ]
    };
}
