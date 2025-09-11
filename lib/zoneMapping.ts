import { DiscoZone, Location } from '../types/grid.types';

// Comprehensive LGA (Local Government Area) to DISCO mapping based on official Nigerian data
const LGA_TO_DISCO_MAPPING: Record<string, string> = {
  // FCT - Abuja DISCO
  'abaji': 'abuja',
  'abuja-municipal': 'abuja',
  'bwari': 'abuja',
  'gwagwalada': 'abuja',
  'kuje': 'abuja',
  'kwali': 'abuja',
  
  // Niger State - Abuja DISCO
  'agaie': 'abuja',
  'agwara': 'abuja',
  'bida': 'abuja',
  'borgu': 'abuja',
  'bosso': 'abuja',
  'chanchaga': 'abuja',
  'edati': 'abuja',
  'gbako': 'abuja',
  'gurara': 'abuja',
  'katcha': 'abuja',
  'kontagora': 'abuja',
  'lapai': 'abuja',
  'lavun': 'abuja',
  'magama': 'abuja',
  'mariga': 'abuja',
  'mashegu': 'abuja',
  'mokwa': 'abuja',
  'muya': 'abuja',
  'pailoro': 'abuja',
  'rafi': 'abuja',
  'rijau': 'abuja',
  'shiroro': 'abuja',
  'suleja': 'abuja',
  'tafa': 'abuja',
  'wushishi': 'abuja',
  
  // Nassarawa State - Abuja DISCO
  'akwanga': 'abuja',
  'awe': 'abuja',
  'doma': 'abuja',
  'karu': 'abuja',
  'keana': 'abuja',
  'keffi': 'abuja',
  'kokona': 'abuja',
  'lafia': 'abuja',
  'nasarawa': 'abuja',
  'nasarawa-eggon': 'abuja',
  'obi': 'abuja',
  'toto': 'abuja',
  'wamba': 'abuja',
  
  // Kogi State - Abuja DISCO
  'adavi': 'abuja',
  'ajaokuta': 'abuja',
  'ankpa': 'abuja',
  'bassa-kogi': 'abuja',
  'dekina': 'abuja',
  'ibaji': 'abuja',
  'idah': 'abuja',
  'igalamela-odolu': 'abuja',
  'ijumu': 'abuja',
  'kabba/bunu': 'abuja',
  'kogi': 'abuja',
  'lokoja': 'abuja',
  'mopa-muro': 'abuja',
  'ofu': 'abuja',
  'ogori/mangongo': 'abuja',
  'okehi': 'abuja',
  'okene': 'abuja',
  'olamabolo': 'abuja',
  'omala': 'abuja',
  'yagba-east': 'abuja',
  'yagba-west': 'abuja',
  
  // Edo State - Benin DISCO
  'esan-north-east': 'benin',
  'esan-central': 'benin',
  'esan-west': 'benin',
  'egor': 'benin',
  'ukpoba': 'benin',
  'central': 'benin',
  'etsako-central': 'benin',
  'igueben': 'benin',
  'oredo': 'benin',
  'ovia-southwest': 'benin',
  'ovia-south-east': 'benin',
  'orhionwon': 'benin',
  'uhunmwonde': 'benin',
  'etsako-east': 'benin',
  'esan-south-east': 'benin',
  
  // Delta State - Benin DISCO
  'oshimili': 'benin',
  'aniocha': 'benin',
  'aniocha-south': 'benin',
  'ika-south': 'benin',
  'ika-north-east': 'benin',
  'ndokwa-west': 'benin',
  'ndokwa-east': 'benin',
  'isoko-south': 'benin',
  'isoko-north': 'benin',
  'bomadi': 'benin',
  'burutu': 'benin',
  'ughelli-south': 'benin',
  'ughelli-north': 'benin',
  'ethiope-west': 'benin',
  'ethiope-east': 'benin',
  'sapele': 'benin',
  'okpe': 'benin',
  'warri-north': 'benin',
  'warri-south': 'benin',
  'uvwie': 'benin',
  'udu': 'benin',
  'warri-central': 'benin',
  'ukwani': 'benin',
  'oshimili-north': 'benin',
  'patani': 'benin',
  
  // Ondo State - Benin DISCO
  'akoko-north-east': 'benin',
  'akoko-north-west': 'benin',
  'akoko-south-akure-east': 'benin',
  'akoko-south-west': 'benin',
  'akure-north': 'benin',
  'akure-south': 'benin',
  'ese-odo': 'benin',
  'idanre': 'benin',
  'ifedore': 'benin',
  'ilaje': 'benin',
  'ile-oluji': 'benin',
  'okeigbo': 'benin',
  'irele': 'benin',
  'odigbo': 'benin',
  'okitipupa': 'benin',
  'ondo-east': 'benin',
  'ondo-west': 'benin',
  'ose': 'benin',
  'owo': 'benin',
  
  // Ekiti State - Benin DISCO
  'ado': 'benin',
  'ekiti-east': 'benin',
  'ekiti-west': 'benin',
  'emure/ise/orun': 'benin',
  'ekiti-south-west': 'benin',
  'ikere': 'benin',
  'irepodun-ekiti': 'benin',
  'ijero': 'benin',
  'ido/osi': 'benin',
  'oye': 'benin',
  'ikole': 'benin',
  'moba': 'benin',
  'gbonyin': 'benin',
  'efon': 'benin',
  'ise/orun': 'benin',
  'ilejemeje': 'benin',
  
  // Lagos State - Ikeja DISCO (Mainland)
  'agege': 'ikeja',
  'ajeromi-ifelodun': 'ikeja',
  'alimosho': 'ikeja',
  'amuwo-odofin': 'ikeja',
  'badagry': 'ikeja',
  'epe': 'ikeja',
  'ibeju/lekki': 'ikeja',
  'ifako-ijaye': 'ikeja',
  'ikeja': 'ikeja',
  'ikorodu': 'ikeja',
  'kosofe': 'ikeja',
  'mushin': 'ikeja',
  'ojo': 'ikeja',
  'oshodi-isolo': 'ikeja',
  'shomolu': 'ikeja',
  
  // Lagos State - Eko DISCO (Island/Central)
  'apapa': 'eko',
  'eti-osa': 'eko',
  'lagos-island': 'eko',
  'lagos-mainland': 'eko',
  'surulere': 'eko',
  'surulere-lagos': 'eko',
  
  // Enugu State - Enugu DISCO
  'enugu-south': 'enugu',
  'igbo-eze-south': 'enugu',
  'enugu-north': 'enugu',
  'nkanu': 'enugu',
  'udi-agwu': 'enugu',
  'oji-river': 'enugu',
  'ezeagu': 'enugu',
  'igboeze-north': 'enugu',
  'isi-uzo': 'enugu',
  'nsukka': 'enugu',
  'igbo-ekiti': 'enugu',
  'uzo-uwani': 'enugu',
  'enugu-eas': 'enugu',
  'aninri': 'enugu',
  'nkanu-east': 'enugu',
  'udenu': 'enugu',
  
  // Anambra State - Enugu DISCO
  'aguata': 'enugu',
  'anambra-east': 'enugu',
  'anambra-west': 'enugu',
  'anaocha': 'enugu',
  'awka-north': 'enugu',
  'awka-south': 'enugu',
  'ayamelum': 'enugu',
  'dunukofia': 'enugu',
  'ekwusigo': 'enugu',
  'idemili-north': 'enugu',
  'idemili-south': 'enugu',
  'ihiala': 'enugu',
  'njikoka': 'enugu',
  'nnewi-north': 'enugu',
  'nnewi-south': 'enugu',
  'ogbaru': 'enugu',
  'onitsha-north': 'enugu',
  'onitsha-south': 'enugu',
  'orumba-north': 'enugu',
  'orumba-south': 'enugu',
  'oyi': 'enugu',
  
  // Abia State - Enugu DISCO
  'aba-north': 'enugu',
  'aba-south': 'enugu',
  'arochukwu': 'enugu',
  'bende': 'enugu',
  'ikwuano': 'enugu',
  'isiala-ngwa-north': 'enugu',
  'isiala-ngwa-south': 'enugu',
  'isuikwato': 'enugu',
  'obi-nwa': 'enugu',
  'ohafia': 'enugu',
  'osisioma': 'enugu',
  'ngwa': 'enugu',
  'ugwunagbo': 'enugu',
  'ukwa-east': 'enugu',
  'ukwa-west': 'enugu',
  'umuahia-north': 'enugu',
  'umuahia-south': 'enugu',
  'umu-neochi': 'enugu',
  
  // Imo State - Enugu DISCO
  'aboh-mbaise': 'enugu',
  'ahiazu-mbaise': 'enugu',
  'ehime-mbano': 'enugu',
  'ezinihitte': 'enugu',
  'ideato-north': 'enugu',
  'ideato-south': 'enugu',
  'ihitte/uboma': 'enugu',
  'ikeduru': 'enugu',
  'isiala-mbano': 'enugu',
  'isu': 'enugu',
  'mbaitoli': 'enugu',
  'ngor-okpala': 'enugu',
  'njaba': 'enugu',
  'nwangele': 'enugu',
  'nkwerre': 'enugu',
  'obowo': 'enugu',
  'oguta': 'enugu',
  'ohaji/egbema': 'enugu',
  'okigwe': 'enugu',
  'orlu': 'enugu',
  'orsu': 'enugu',
  'oru-east': 'enugu',
  'oru-west': 'enugu',
  'owerri-municipal': 'enugu',
  'owerri-north': 'enugu',
  'owerri-west': 'enugu',
  
  // Ebonyi State - Enugu DISCO
  'edda': 'enugu',
  'afikpo': 'enugu',
  'onicha': 'enugu',
  'ohaozara': 'enugu',
  'abakaliki': 'enugu',
  'ishielu': 'enugu',
  'ikwo': 'enugu',
  'ezza': 'enugu',
  'ezza-south': 'enugu',
  'ohaukwu': 'enugu',
  'ebonyi': 'enugu',
  'ivo': 'enugu',
  
  // Ogun State - Ibadan DISCO (most areas)
  'abeokuta-north': 'ibadan',
  'abeokuta-south': 'ibadan',
  'yewa-north': 'ibadan',
  'yewa-south': 'ibadan',
  'ijebu-east': 'ibadan',
  'ijebu-north': 'ibadan',
  'ijebu-north-east': 'ibadan',
  'ijebu-ode': 'ibadan',
  'ikenne': 'ibadan',
  'imeko-afon': 'ibadan',
  'ipokia': 'ibadan',
  'ogun-waterside': 'ibadan',
  'odeda': 'ibadan',
  'odogbolu': 'ibadan',
  'remo-north': 'ibadan',
  'shagamu': 'ibadan',
  
  // Ogun State - Ikeja DISCO (border areas)
  'ado-odo/ota': 'ikeja',
  'ewekoro': 'ikeja',
  'ifo': 'ikeja',
  'obafemi-owode': 'ikeja',
  
  // Oyo State - Ibadan DISCO
  'afijio': 'ibadan',
  'akinyele': 'ibadan',
  'atiba': 'ibadan',
  'atisbo': 'ibadan',
  'egbeda': 'ibadan',
  'ibadan-central': 'ibadan',
  'ibadan-north': 'ibadan',
  'ibadan-north-west': 'ibadan',
  'ibadan-south-east': 'ibadan',
  'ibadan-south-west': 'ibadan',
  'ibarapa-central': 'ibadan',
  'ibarapa-east': 'ibadan',
  'ibarapa-north': 'ibadan',
  'ido': 'ibadan',
  'irepo': 'ibadan',
  'iseyin': 'ibadan',
  'itesiwaju': 'ibadan',
  'iwajowa': 'ibadan',
  'kajola': 'ibadan',
  'lagelu-ogbomosho-north': 'ibadan',
  'ogbomosho-south': 'ibadan',
  'ogo-oluwa': 'ibadan',
  'olorunsogo': 'ibadan',
  'oluyole': 'ibadan',
  'ona-ara': 'ibadan',
  'orelope': 'ibadan',
  'ori-ire': 'ibadan',
  'oyo-east': 'ibadan',
  'oyo-west': 'ibadan',
  'saki-east': 'ibadan',
  'saki-west': 'ibadan',
  'surulere-oyo': 'ibadan',
  
  // Osun State - Ibadan DISCO
  'aiyedade': 'ibadan',
  'aiyedire': 'ibadan',
  'atakumosa-east': 'ibadan',
  'atakumosa-west': 'ibadan',
  'boluwaduro': 'ibadan',
  'boripe': 'ibadan',
  'ede-north': 'ibadan',
  'ede-south': 'ibadan',
  'egbedore': 'ibadan',
  'ejigbo': 'ibadan',
  'ife-central': 'ibadan',
  'ife-east': 'ibadan',
  'ife-north': 'ibadan',
  'ife-south': 'ibadan',
  'ifedayo': 'ibadan',
  'ifelodun-osun': 'ibadan',
  'ila': 'ibadan',
  'ilesha-east': 'ibadan',
  'ilesha-west': 'ibadan',
  'irepodun-osun': 'ibadan',
  'irewole': 'ibadan',
  'isokan': 'ibadan',
  'iwo': 'ibadan',
  'obokun': 'ibadan',
  'odo-otin': 'ibadan',
  'ola-oluwa': 'ibadan',
  'olorunda': 'ibadan',
  'oriade': 'ibadan',
  'orolu': 'ibadan',
  'osogbo': 'ibadan',
  
  // Kwara State - Ibadan DISCO
  'asa': 'ibadan',
  'baruten': 'ibadan',
  'edu': 'ibadan',
  'ekiti': 'ibadan',
  'ifelodun-kwara': 'ibadan',
  'ilorin-east': 'ibadan',
  'ilorin-west': 'ibadan',
  'irepodun-kwara': 'ibadan',
  'isin': 'ibadan',
  'kaiama': 'ibadan',
  'moro': 'ibadan',
  'offa': 'ibadan',
  'oke-ero': 'ibadan',
  'oyun': 'ibadan',
  'pategi': 'ibadan',
  
  // Plateau State - Jos DISCO
  'barikin-ladi': 'jos',
  'bassa-plateau': 'jos',
  'bokkos': 'jos',
  'jos-east': 'jos',
  'jos-north': 'jos',
  'jos-south': 'jos',
  'kanam': 'jos',
  'kanke': 'jos',
  'langtang-north': 'jos',
  'langtang-south': 'jos',
  'mangu': 'jos',
  'mikang': 'jos',
  'pankshin': 'jos',
  'quaan-pan': 'jos',
  'riyom': 'jos',
  'shendam': 'jos',
  'wase': 'jos',
  
  // Bauchi State - Jos DISCO
  'alkaleri': 'jos',
  'bauchi': 'jos',
  'bogoro': 'jos',
  'damban': 'jos',
  'darazo': 'jos',
  'dass': 'jos',
  'ganjuwa': 'jos',
  'giade': 'jos',
  'itas/gadau': 'jos',
  'jamaare': 'jos',
  'katagum': 'jos',
  'kirfi': 'jos',
  'misau': 'jos',
  'ningi': 'jos',
  'shira': 'jos',
  'tafawa-balewa': 'jos',
  'toro': 'jos',
  'warji': 'jos',
  'zaki': 'jos',
  
  // Gombe State - Jos DISCO
  'akko': 'jos',
  'balanga': 'jos',
  'billiri': 'jos',
  'dukku': 'jos',
  'kaltungo': 'jos',
  'kwami': 'jos',
  'shomgom': 'jos',
  'funakaye': 'jos',
  'gombe': 'jos',
  'nafada/bajoga': 'jos',
  'yamaltu/delta': 'jos',
  
  // Kaduna State - Kaduna DISCO
  'birni-gwari': 'kaduna',
  'chikun': 'kaduna',
  'giwa': 'kaduna',
  'igabi': 'kaduna',
  'ikara': 'kaduna',
  'jaba': 'kaduna',
  'jemaa': 'kaduna',
  'kachia': 'kaduna',
  'kaduna-north': 'kaduna',
  'kaduna-south': 'kaduna',
  'kagarko': 'kaduna',
  'kajuru': 'kaduna',
  'kaura-kaduna': 'kaduna',
  'kauru': 'kaduna',
  'kubau': 'kaduna',
  'kudan': 'kaduna',
  'lere': 'kaduna',
  'makarfi': 'kaduna',
  'sabon-gari': 'kaduna',
  'sanga': 'kaduna',
  'soba': 'kaduna',
  'zango-kataf': 'kaduna',
  'zaria': 'kaduna',
  
  // Kebbi State - Kaduna DISCO
  'aleiro': 'kaduna',
  'arewa-dandi': 'kaduna',
  'argungu': 'kaduna',
  'augie': 'kaduna',
  'bagudo': 'kaduna',
  'birnin-kebbi': 'kaduna',
  'bunza': 'kaduna',
  'dandi': 'kaduna',
  'fakai': 'kaduna',
  'gwandu': 'kaduna',
  'jega': 'kaduna',
  'kalgo': 'kaduna',
  'koko/besse': 'kaduna',
  'maiyama': 'kaduna',
  'ngaski': 'kaduna',
  'sakaba': 'kaduna',
  'shanga': 'kaduna',
  'suru': 'kaduna',
  'wasagu/danko': 'kaduna',
  'yauri': 'kaduna',
  'zuru': 'kaduna',
  
  // Sokoto State - Kaduna DISCO
  'binji': 'kaduna',
  'bodinga': 'kaduna',
  'dange-shnsi': 'kaduna',
  'gada': 'kaduna',
  'goronyo': 'kaduna',
  'gudu': 'kaduna',
  'gawabawa': 'kaduna',
  'illela': 'kaduna',
  'isa': 'kaduna',
  'kware': 'kaduna',
  'kebbe': 'kaduna',
  'rabah': 'kaduna',
  'sabon-birni': 'kaduna',
  'shagari': 'kaduna',
  'silame': 'kaduna',
  'sokoto-north': 'kaduna',
  'sokoto-south': 'kaduna',
  'tambuwal': 'kaduna',
  'tqngaza': 'kaduna',
  'tureta': 'kaduna',
  'wamako': 'kaduna',
  'wurno': 'kaduna',
  'yabo': 'kaduna',
  
  // Zamfara State - Kaduna DISCO
  'anka': 'kaduna',
  'bakura': 'kaduna',
  'birnin-magaji': 'kaduna',
  'bukkuyum': 'kaduna',
  'bungudu': 'kaduna',
  'gummi': 'kaduna',
  'gusau': 'kaduna',
  'kaura-zamfara': 'kaduna',
  'namoda': 'kaduna',
  'maradun': 'kaduna',
  'maru': 'kaduna',
  'shinkafi': 'kaduna',
  'talata-mafara': 'kaduna',
  'tsafe': 'kaduna',
  'zurmi': 'kaduna',
  
  // Kano State - Kano DISCO
  'ajingi': 'kano',
  'albasu': 'kano',
  'bagwai': 'kano',
  'bebeji': 'kano',
  'bichi': 'kano',
  'bunkure': 'kano',
  'dala': 'kano',
  'dambatta': 'kano',
  'dawakin-kudu': 'kano',
  'dawakin-tofa': 'kano',
  'doguwa': 'kano',
  'fagge': 'kano',
  'gabasawa': 'kano',
  'garko': 'kano',
  'garum': 'kano',
  'mallam': 'kano',
  'gaya': 'kano',
  'gezawa': 'kano',
  'gwale': 'kano',
  'gwarzo': 'kano',
  'kabo': 'kano',
  'kano-municipal': 'kano',
  'karaye': 'kano',
  'kibiya': 'kano',
  'kiru': 'kano',
  'kumbotso': 'kano',
  'ghari': 'kano',
  'kura': 'kano',
  'madobi': 'kano',
  'makoda': 'kano',
  'minjibir': 'kano',
  'nasarawa-kano': 'kano',
  'rano': 'kano',
  'rimin-gado': 'kano',
  'rogo': 'kano',
  'shanono': 'kano',
  'sumaila': 'kano',
  'takali': 'kano',
  'tarauni': 'kano',
  'tofa': 'kano',
  'tsanyawa': 'kano',
  'tudun-wada': 'kano',
  'ungogo': 'kano',
  'warawa': 'kano',
  'wudil': 'kano',
  
  // Katsina State - Kano DISCO
  'bakori': 'kano',
  'batagarawa': 'kano',
  'batsari': 'kano',
  'baure': 'kano',
  'bindawa': 'kano',
  'charanchi': 'kano',
  'dandume': 'kano',
  'danja': 'kano',
  'dan-musa': 'kano',
  'daura': 'kano',
  'dutsi': 'kano',
  'dutsin-ma': 'kano',
  'faskari': 'kano',
  'funtua': 'kano',
  'ingawa': 'kano',
  'jibia': 'kano',
  'kafur': 'kano',
  'kaita': 'kano',
  'kankara': 'kano',
  'kankia': 'kano',
  'katsina': 'kano',
  'kurfi': 'kano',
  'kusada': 'kano',
  'maiadua': 'kano',
  'malumfashi': 'kano',
  'mani': 'kano',
  'mashi': 'kano',
  'matazuu': 'kano',
  'musawa': 'kano',
  'rimi': 'kano',
  'sabuwa': 'kano',
  'safana': 'kano',
  'sandamu': 'kano',
  'zango': 'kano',
  
  // Jigawa State - Kano DISCO
  'auyo': 'kano',
  'babura': 'kano',
  'birni-kudu': 'kano',
  'biriniwa': 'kano',
  'buji': 'kano',
  'dutse': 'kano',
  'gagarawa': 'kano',
  'garki': 'kano',
  'gumel': 'kano',
  'guri': 'kano',
  'gwaram': 'kano',
  'gwiwa': 'kano',
  'hadejia': 'kano',
  'jahun': 'kano',
  'kafin-hausa': 'kano',
  'kaugama-kazaure': 'kano',
  'kiri-kasamma': 'kano',
  'kiyawa': 'kano',
  'maigatari': 'kano',
  'malam-madori': 'kano',
  'miga': 'kano',
  'ringim': 'kano',
  'roni': 'kano',
  'sule-tankarkar': 'kano',
  'taura': 'kano',
  'yankwashi': 'kano',
  
  // Rivers State - Port Harcourt DISCO
  'abua/odual': 'portharcourt',
  'ahoada-east': 'portharcourt',
  'ahoada-west': 'portharcourt',
  'akuku-toru': 'portharcourt',
  'andoni': 'portharcourt',
  'asari-toru': 'portharcourt',
  'bonny': 'portharcourt',
  'degema': 'portharcourt',
  'emohua': 'portharcourt',
  'eleme': 'portharcourt',
  'etche': 'portharcourt',
  'gokana': 'portharcourt',
  'ikwerre': 'portharcourt',
  'khana': 'portharcourt',
  'obio/akpor': 'portharcourt',
  'ogba/egbema/ndoni': 'portharcourt',
  'ogu/bolo': 'portharcourt',
  'okrika': 'portharcourt',
  'omumma': 'portharcourt',
  'opobo/nkoro': 'portharcourt',
  'oyigbo': 'portharcourt',
  'port-harcourt': 'portharcourt',
  'tai': 'portharcourt',
  
  // Bayelsa State - Port Harcourt DISCO
  'brass': 'portharcourt',
  'ekeremor': 'portharcourt',
  'kolokuma/opokuma': 'portharcourt',
  'nembe': 'portharcourt',
  'ogbia': 'portharcourt',
  'sagbama': 'portharcourt',
  'southern-jaw': 'portharcourt',
  'yenegoa': 'portharcourt',
  
  // Cross River State - Port Harcourt DISCO
  'akpabuyo': 'portharcourt',
  'odukpani': 'portharcourt',
  'akamkpa': 'portharcourt',
  'biase': 'portharcourt',
  'abi': 'portharcourt',
  'ikom': 'portharcourt',
  'yarkur': 'portharcourt',
  'odubra': 'portharcourt',
  'boki': 'portharcourt',
  'ogoja': 'portharcourt',
  'yala': 'portharcourt',
  'obanliku': 'portharcourt',
  'obudu': 'portharcourt',
  'calabar-south': 'portharcourt',
  'etung': 'portharcourt',
  'bekwara': 'portharcourt',
  'bakassi': 'portharcourt',
  'calabar-municipality': 'portharcourt',
  
  // Akwa Ibom State - Port Harcourt DISCO
  'abak': 'portharcourt',
  'eastern-obolo': 'portharcourt',
  'eket': 'portharcourt',
  'esit-eket': 'portharcourt',
  'essien-udim': 'portharcourt',
  'etim-ekpo': 'portharcourt',
  'etinan': 'portharcourt',
  'ibeno': 'portharcourt',
  'ibesikpo-asutan': 'portharcourt',
  'ibiono-ibom': 'portharcourt',
  'ika': 'portharcourt',
  'ikono': 'portharcourt',
  'ikot-abasi': 'portharcourt',
  'ikot-ekpene': 'portharcourt',
  'ini': 'portharcourt',
  'itu': 'portharcourt',
  'mbo': 'portharcourt',
  'mkpat-enin': 'portharcourt',
  'nsit-atai': 'portharcourt',
  'nsit-ibom': 'portharcourt',
  'nsit-ubium': 'portharcourt',
  'obot-akara': 'portharcourt',
  'okobo': 'portharcourt',
  'onna': 'portharcourt',
  'oron': 'portharcourt',
  'oruk-anam': 'portharcourt',
  'udung-uko': 'portharcourt',
  'ukanafun': 'portharcourt',
  'uruan': 'portharcourt',
  'urue-offong/oruko': 'portharcourt',
  'uyo': 'portharcourt',
  
  // Adamawa State - Yola DISCO
  'demsa': 'yola',
  'fufore': 'yola',
  'ganaye': 'yola',
  'gireri': 'yola',
  'gombi': 'yola',
  'guyuk': 'yola',
  'hong': 'yola',
  'jada': 'yola',
  'lamurde': 'yola',
  'madagali': 'yola',
  'maiha': 'yola',
  'mayo-belwa': 'yola',
  'michika': 'yola',
  'mubi-north': 'yola',
  'mubi-south': 'yola',
  'numan': 'yola',
  'shelleng': 'yola',
  'song': 'yola',
  'toungo': 'yola',
  'yola-north': 'yola',
  'yola-south': 'yola',
  
  // Taraba State - Yola DISCO
  'ardo-kola': 'yola',
  'bali': 'yola',
  'donga': 'yola',
  'gashaka': 'yola',
  'cassol': 'yola',
  'ibi': 'yola',
  'jalingo': 'yola',
  'karin-lamido': 'yola',
  'kurmi': 'yola',
  'lau': 'yola',
  'sardauna': 'yola',
  'takum': 'yola',
  'ussa': 'yola',
  'wukari': 'yola',
  'yorro': 'yola',
  'zing': 'yola',
  
  // Borno State - Yola DISCO
  'abadam': 'yola',
  'askira/uba': 'yola',
  'bama': 'yola',
  'bayo': 'yola',
  'biu': 'yola',
  'chibok': 'yola',
  'damboa': 'yola',
  'dikwa': 'yola',
  'gubio': 'yola',
  'guzamala': 'yola',
  'gwoza': 'yola',
  'hawul': 'yola',
  'jere': 'yola',
  'kaga': 'yola',
  'kala/balge': 'yola',
  'konduga': 'yola',
  'kukawa': 'yola',
  'kwaya-kusar': 'yola',
  'mafa': 'yola',
  'magumeri': 'yola',
  'maiduguri': 'yola',
  'marte': 'yola',
  'mobbar': 'yola',
  'monguno': 'yola',
  'ngala': 'yola',
  'nganzai': 'yola',
  'shani': 'yola',
  
  // Yobe State - Yola DISCO
  'bade': 'yola',
  'bursari': 'yola',
  'damaturu': 'yola',
  'fika': 'yola',
  'fune': 'yola',
  'geidam': 'yola',
  'gujba': 'yola',
  'gulani': 'yola',
  'jakusko': 'yola',
  'karasuwa': 'yola',
  'karawa': 'yola',
  'machina': 'yola',
  'nangere': 'yola',
  'nguru-potiskum': 'yola',
  'tarmua': 'yola',
  'yunusari': 'yola',
  'yusufari': 'yola',
  
  // Benue State - Various DISCOs (split between Abuja and others)
  'ado': 'abuja',
  'agatu': 'abuja',
  'apa': 'abuja',
  'buruku': 'abuja',
  'gboko': 'abuja',
  'guma': 'abuja',
  'gwer-east': 'abuja',
  'gwer-west': 'abuja',
  'katsina-ala': 'abuja',
  'konshisha': 'abuja',
  'kwande': 'abuja',
  'logo': 'abuja',
  'makurdi': 'abuja',
  'obi': 'abuja',
  'ogbadibo': 'abuja',
  'oju': 'abuja',
  'okpokwu': 'abuja',
  'ohimini': 'abuja',
  'oturkpo': 'abuja',
  'tarka': 'abuja',
  'ukum': 'abuja',
  'ushongo': 'abuja',
  'vandeikya': 'abuja',
};

// Nigerian Distribution Companies (DISCOs) and their service areas
export const DISCO_ZONES: DiscoZone[] = [
  {
    id: 'abuja',
    name: 'Abuja DISCO',
    fullName: 'Abuja Electricity Distribution Company',
    states: ['Federal Capital Territory', 'Niger', 'Nassarawa', 'Kogi'],
    coordinates: {
      center: { lat: 9.0765, lng: 7.3986, address: 'Abuja, Nigeria' },
      bounds: {
        north: 10.9,
        south: 7.0,
        east: 8.5,
        west: 5.5
      }
    },
    color: '#3B82F6',
    status: 'online'
  },
  {
    id: 'benin',
    name: 'Benin DISCO',
    fullName: 'Benin Electricity Distribution Company',
    states: ['Edo', 'Delta', 'Ondo', 'Ekiti'],
    coordinates: {
      center: { lat: 6.3350, lng: 5.6037, address: 'Benin City, Nigeria' },
      bounds: {
        north: 7.8,
        south: 5.0,
        east: 6.8,
        west: 4.2
      }
    },
    color: '#10B981',
    status: 'online'
  },
  {
    id: 'ikeja',
    name: 'Ikeja DISCO',
    fullName: 'Ikeja Electric Distribution Company',
    states: ['Lagos (Mainland, Ikeja, Agege, Alimosho, Ikorodu, Badagry)'],
    coordinates: {
      center: { lat: 6.5955, lng: 3.3087, address: 'Ikeja, Lagos, Nigeria' },
      bounds: {
        north: 6.90,  // Extended further north for Alimosho/Agege
        south: 6.45,  // Raised to prevent overlap with southern areas
        east: 3.35,   // Adjusted to prevent Eko overlap
        west: 2.70    // Extended west to cover Badagry corridor
      }
    },
    color: '#06B6D4',
    status: 'online'
  },
  {
    id: 'eko',
    name: 'Eko DISCO',
    fullName: 'Eko Electricity Distribution Company (EKEDCO)',
    states: ['Lagos (Apapa, Festac, Ikoyi, Lekki, Ijetu, Ojo, Orile, Mushin, Victoria Island, Ikoyi)'],
    coordinates: {
      center: { lat: 6.4554, lng: 3.4200, address: 'Lagos Island, Nigeria' },
      bounds: {
        north: 6.68,
        south: 6.40,
        east: 3.70,   // Eastern Lagos coastal areas (Lekki, etc.)
        west: 3.35    // Lagos Island core area
      }
    },
    color: '#F59E0B',
    status: 'online'
  },
  {
    id: 'enugu',
    name: 'Enugu DISCO',
    fullName: 'Enugu Electricity Distribution Company',
    states: ['Enugu', 'Anambra', 'Abia', 'Imo', 'Ebonyi'],
    coordinates: {
      center: { lat: 6.5244, lng: 7.5086, address: 'Enugu, Nigeria' },
      bounds: {
        north: 7.5,
        south: 4.8,
        east: 8.5,
        west: 6.0
      }
    },
    color: '#8B5CF6',
    status: 'online'
  },
  {
    id: 'ibadan',
    name: 'Ibadan DISCO',
    fullName: 'Ibadan Electricity Distribution Company',
    states: ['Oyo', 'Osun', 'Kwara', 'Ogun (northern parts)'],
    coordinates: {
      center: { lat: 7.3775, lng: 3.9470, address: 'Ibadan, Nigeria' },
      bounds: {
        north: 9.5,
        south: 6.8,   // Raised to exclude Lagos areas
        east: 5.5,
        west: 2.5
      }
    },
    color: '#EF4444',
    status: 'online'
  },
  {
    id: 'jos',
    name: 'Jos DISCO',
    fullName: 'Jos Electricity Distribution Company',
    states: ['Plateau', 'Bauchi', 'Gombe', 'Adamawa (parts)'],
    coordinates: {
      center: { lat: 9.8965, lng: 8.8583, address: 'Jos, Nigeria' },
      bounds: {
        north: 12.5,
        south: 8.0,
        east: 14.0,
        west: 7.5
      }
    },
    color: '#84CC16',
    status: 'online'
  },
  {
    id: 'kaduna',
    name: 'Kaduna DISCO',
    fullName: 'Kaduna Electric Distribution Company',
    states: ['Kaduna', 'Kebbi', 'Sokoto', 'Zamfara'],
    coordinates: {
      center: { lat: 10.5222, lng: 7.4383, address: 'Kaduna, Nigeria' },
      bounds: {
        north: 13.9,
        south: 9.0,
        east: 8.0,
        west: 4.2
      }
    },
    color: '#F97316',
    status: 'online'
  },
  {
    id: 'kano',
    name: 'Kano DISCO',
    fullName: 'Kano Electricity Distribution Company',
    states: ['Kano', 'Katsina', 'Jigawa'],
    coordinates: {
      center: { lat: 11.9999, lng: 8.5217, address: 'Kano, Nigeria' },
      bounds: {
        north: 13.5,
        south: 10.5,
        east: 10.5,
        west: 7.0
      }
    },
    color: '#EC4899',
    status: 'online'
  },
  {
    id: 'portharcourt',
    name: 'Port Harcourt DISCO',
    fullName: 'Port Harcourt Electricity Distribution Company',
    states: ['Rivers', 'Bayelsa', 'Cross River', 'Akwa Ibom'],
    coordinates: {
      center: { lat: 4.8156, lng: 7.0498, address: 'Port Harcourt, Nigeria' },
      bounds: {
        north: 6.0,
        south: 4.0,
        east: 9.0,
        west: 5.5
      }
    },
    color: '#14B8A6',
    status: 'online'
  },
  {
    id: 'yola',
    name: 'Yola DISCO',
    fullName: 'Yola Electricity Distribution Company',
    states: ['Adamawa', 'Taraba', 'Borno'],
    coordinates: {
      center: { lat: 9.2001, lng: 12.4811, address: 'Yola, Nigeria' },
      bounds: {
        north: 13.9,
        south: 6.0,
        east: 14.9,
        west: 10.0
      }
    },
    color: '#6366F1',
    status: 'online'
  }
];

/**
 * Extracts potential LGA names from an address string
 * @param address - The address string to parse
 * @returns Array of potential LGA names found in the address
 */
function extractLGAFromAddress(address: string): string[] {
  const normalizedAddress = address.toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^\w\s-]/g, ''); // Remove special characters except hyphens
  
  const potentialLGAs: string[] = [];
  
  // Check for exact LGA matches
  for (const lga of Object.keys(LGA_TO_DISCO_MAPPING)) {
    if (normalizedAddress.includes(lga)) {
      potentialLGAs.push(lga);
    }
  }
  
  // Also check for common variations and abbreviations
  const lgaVariations: Record<string, string> = {
    'mainland': 'lagos-mainland',
    'island': 'lagos-island',
    'vi': 'lagos-island', // Victoria Island
    'ikoyi': 'lagos-island',
    'lekki': 'eti-osa',
    'victoria-island': 'lagos-island',
    'festac': 'amuwo-odofin',
    'surulere-lagos': 'surulere',
    'yaba': 'yaba',
    'ikeja': 'ikeja',
    'agege': 'agege',
    'alimosho': 'alimosho',
    'oshodi': 'oshodi-isolo',
    'isolo': 'oshodi-isolo',
    'mushin': 'mushin',
    'apapa': 'apapa',
  };
  
  for (const [variation, lga] of Object.entries(lgaVariations)) {
    if (normalizedAddress.includes(variation) && LGA_TO_DISCO_MAPPING[lga]) {
      potentialLGAs.push(lga);
    }
  }
  
  return [...new Set(potentialLGAs)]; // Remove duplicates
}

/**
 * Determines which DISCO zone serves a given location using LGA-based mapping
 * @param location - The location to check
 * @returns The DISCO zone that serves the location, or null if not found
 */
export function getDiscoForLocation(location: Location): DiscoZone | null {
  const { lat, lng, address } = location;

  console.log(`🔍 Checking location: lat=${lat}, lng=${lng}, address="${address}"`);

  // STEP 1: Try LGA-based mapping first (most accurate)
  const potentialLGAs = extractLGAFromAddress(address);
  console.log(`📍 Extracted potential LGAs: ${potentialLGAs.join(', ')}`);
  
  if (potentialLGAs.length > 0) {
    // Use the first matched LGA
    const matchedLGA = potentialLGAs[0];
    const discoId = LGA_TO_DISCO_MAPPING[matchedLGA];
    
    if (discoId) {
      const disco = DISCO_ZONES.find(d => d.id === discoId);
      if (disco) {
        console.log(`✅ LGA Match: ${matchedLGA} → ${disco.fullName}`);
        return disco;
      }
    }
  }

  console.log(`⚠️ No LGA match found, falling back to coordinate-based mapping`);

  // STEP 2: Fall back to coordinate-based mapping
  for (const disco of DISCO_ZONES) {
    const { bounds } = disco.coordinates;
    
    const inBounds = lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east;
    
    // Debug: Log boundary check for Lagos DISCOs and Ibadan
    if (disco.id === 'eko' || disco.id === 'ikeja' || disco.id === 'ibadan') {
      console.log(`${disco.name}: lat ${bounds.south}-${bounds.north} (${lat >= bounds.south && lat <= bounds.north}), lng ${bounds.west}-${bounds.east} (${lng >= bounds.west && lng <= bounds.east}) = ${inBounds}`);
    }
    
    if (inBounds) {
      console.log(`✅ Coordinate Match: ${disco.fullName}`);
      return disco;
    }
  }

  console.log(`⚠️ No coordinate match found, using closest DISCO`);

  // STEP 3: Find the closest DISCO by distance as last resort
  let closestDisco: DiscoZone | null = null;
  let minDistance = Infinity;

  for (const disco of DISCO_ZONES) {
    const distance = calculateDistance(location, disco.coordinates.center);
    if (distance < minDistance) {
      minDistance = distance;
      closestDisco = disco;
    }
  }

  if (closestDisco) {
    console.log(`📏 Closest DISCO: ${closestDisco.fullName} (${minDistance.toFixed(2)}km away)`);
  }

  return closestDisco;
}

/**
 * Calculates the distance between two locations using Haversine formula
 * @param location1 - First location
 * @param location2 - Second location
 * @returns Distance in kilometers
 */
function calculateDistance(location1: Location, location2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(location2.lat - location1.lat);
  const dLng = toRadians(location2.lng - location1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(location1.lat)) *
    Math.cos(toRadians(location2.lat)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Gets all DISCO zones
 * @returns Array of all DISCO zones
 */
export function getAllDiscoZones(): DiscoZone[] {
  return DISCO_ZONES;
}

/**
 * Gets a specific DISCO zone by ID
 * @param discoId - The DISCO ID to search for
 * @returns The DISCO zone or null if not found
 */
export function getDiscoById(discoId: string): DiscoZone | null {
  return DISCO_ZONES.find(disco => disco.id === discoId) || null;
}

/**
 * Checks if a location is within Nigeria's approximate bounds
 * @param location - The location to check
 * @returns True if location is likely in Nigeria
 */
export function isLocationInNigeria(location: Location): boolean {
  const { lat, lng } = location;
  
  // Nigeria's approximate bounds
  const nigeriaBounds = {
    north: 14.0,
    south: 4.0,
    east: 14.9,
    west: 2.7
  };

  return (
    lat >= nigeriaBounds.south &&
    lat <= nigeriaBounds.north &&
    lng >= nigeriaBounds.west &&
    lng <= nigeriaBounds.east
  );
}

/**
 * Gets states served by a specific DISCO
 * @param discoId - The DISCO ID
 * @returns Array of states served by the DISCO
 */
export function getStatesForDisco(discoId: string): string[] {
  const disco = getDiscoById(discoId);
  return disco ? disco.states : [];
}

/**
 * Gets DISCO for a specific LGA
 * @param lga - The LGA name (normalized)
 * @returns The DISCO zone that serves the LGA, or null if not found
 */
export function getDiscoByLGA(lga: string): DiscoZone | null {
  const normalizedLGA = lga.toLowerCase().replace(/\s+/g, '-');
  const discoId = LGA_TO_DISCO_MAPPING[normalizedLGA];
  
  if (discoId) {
    return getDiscoById(discoId);
  }
  
  return null;
}

/**
 * Gets all LGAs served by a specific DISCO
 * @param discoId - The DISCO ID
 * @returns Array of LGA names served by the DISCO
 */
export function getLGAsForDisco(discoId: string): string[] {
  const lgas: string[] = [];
  
  for (const [lga, mappedDiscoId] of Object.entries(LGA_TO_DISCO_MAPPING)) {
    if (mappedDiscoId === discoId) {
      lgas.push(lga);
    }
  }
  
  return lgas;
}