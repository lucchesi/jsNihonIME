/**
 * Copyright (c) 2007, 2011, Fernando Lucchesi Bastos Jurema
 * This code is under the MIT license: http://creativecommons.org/licenses/MIT/deed.en
 * 
 * http://www.students.ic.unicamp.br/~ra091187/
 * fernandolbastos [at] gmail [dot] com
 * 
 * This virtual keyboard is free software.
 * Basically, you can use, copy, modify and distribute it in any way.
 */

/**
 * The kanji information was taken from Taka:
 * http://sourceforge.net/projects/taka/
 */


/**
 * HOW TO USE:
 * 
 * First, put the following code at the <home> tag of your page:
 * 
 * 

<!-- JavaScript code that does all the work -->
<script type="text/JavaScript" src="tecladojapones.js"></script>
<!-- Defining the size of the buttons and of the div that will hold them -->
<style type="text/css"> #divbuttons{width: 520px;} .btn {width: 28px;} </style>

 *
 * 
 * then, put this were you want the keyboard to be rendered:
 * 
 * 

<!-- Combobox to select the buttons -->
<select name="chars" size="1" onchange="changebuttons(this);">
	<option>Hiragana</option>
	<option>Katakana</option>
	<option>Jouyou Kanji - 1</option>
	<option>Jouyou Kanji - 2</option>
	<option>Jouyou Kanji - 3</option>
	<option>Jouyou Kanji - 4</option>
	<option>Jouyou Kanji - 5</option>
	<option>Jouyou Kanji - 6</option>
	<option>Jouyou Kanji - 7</option>
	<option>No buttons</option>
</select><br />

<!-- div that will hold the buttons -->
<div id="divbuttons"></div>

<!-- Textarea -->
<textarea id="k_textarea" rows="12" cols="60"  onkeydown="javascript:replacekana();" onkeyup="javascript:replacekana();"></textarea><br />

 *
 * 
 * and that's all!
 * 
 * You are free to change the text of the combobox, as the code
 * will only consider the position of the option.
 * 
 * 
 * If you want, you can just put all the code together, but it's not
 * good practice(i.e. your page will not validate at W3C).
 * 
 * The kanji will not work offline, as the xml can only be read in http.
 */

/*
 * TO DO:
 * Deal with the massive amount of kanji at the higher levels...
 */

/**
 * BEGIN CODE:
 */


/**
 * Defines wich button category will be shown at the beginning.
 * Uncomment the desired line(and comment the other) to change it.
 * Comment all of them for no buttons.
 */
window.onload = hiragana;
//window.onload = katakana;
//window.onload = kanji(1); // Change the number to select the level


// Temporary variable that keeps the buttons code
// (for efficiency, changing the div's code directly is too slow)
var Buttons_tmp="";


/* Function that renders a kanji button */
function kanji_btn(symbol, meaning, on_yomi, kun_yomi)
{
	// Model: <input class=\"btn\" type="button" value="&#26085;" title="Sol, dia (hi)" onclick="javascript:add('&#26085;')">
	Buttons_tmp +=
		'<input class="btn" type="button" value="' + symbol +
		'" title="' + meaning +
		'\nO: ' + on_yomi +
		'\nK: ' + kun_yomi +
		'" onclick="javascript:add(\'' + symbol + '\')">\n';
}


/* Function that adds the button symbol to the textarea */
function add(symbol)
{
	document.getElementById("k_textarea").value += symbol;
}


/* Function that changes the buttons according to the combobox */
function changebuttons(sel)
{
	switch(sel.selectedIndex)
	{
		case 0:
			hiragana();
			break;
		case 1:
			katakana();
			break;
		case 9:
			// No buttons
			document.getElementById("divbuttons").innerHTML = "";
			break;
		default:
			kanji(sel.selectedIndex - 1);
			break;
	}
}


/* Function that renders the kanji buttons of the chosen level */
function kanji(lvl)
{
	// Empties the temporary string
	Buttons_tmp = "";
	
	// Opens the xml file containign the kanji
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET","kanji.xml",false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
	
	// Gets the kanji of that level
	kanji_list = xmlDoc.getElementsByTagName("category")[lvl-1].getElementsByTagName("kanji");
	
	// For each kanji
	for (i=0; i < kanji_list.length; i++)
	{
		// Gets its data
		kanji_char = kanji_list[i].getElementsByTagName("char")[0].childNodes[0].nodeValue;
		meaning = kanji_list[i].getElementsByTagName("meaning")[0].childNodes[0].nodeValue;
		on_list = kanji_list[i].getElementsByTagName("on");
		kun_list = kanji_list[i].getElementsByTagName("kun");
		
		// Strings that will hold the readings
		on = "";
		kun = "";
		
		// Gets the readings, separated by commas
		for (j=0; j < on_list.length; j++)
		{
			// &#12289; = japanese comma
			if( on == "" )
				on = on_list[j].childNodes[0].nodeValue;
			else
				on = on + "&#12289;" + on_list[j].childNodes[0].nodeValue;
		}
		for (j=0; j < kun_list.length; j++)
		{
			if( kun == "" )
				kun = kun_list[j].childNodes[0].nodeValue;
			else
				kun = kun + "&#12289;" + kun_list[j].childNodes[0].nodeValue;
		}
		
		// Generates the button code onto the tmp string
		kanji_btn(kanji_char, meaning, on, kun);
	}
	
	// Draws the buttons inside the div
	document.getElementById("divbuttons").innerHTML = Buttons_tmp;
}


/* Function that renders a kana button */
function kana(symbol, reading)
{
	Buttons_tmp +=
		'<input class="btn" type="button" value="' + symbol +
		'" title="' + reading +
		'" onclick="javascript:add(\'' + symbol + '\')">\n';
}


/* Auxiliary functions, for formatting */
function br() { Buttons_tmp += "<br />"; }
function nbsp2() { Buttons_tmp += "&nbsp;&nbsp;"; }


/* Function that renders the hiragana buttons */
function hiragana()
{	
	// Empties the temporary string
	Buttons_tmp = "";
	
	kana("&#12354;", "a"); kana("&#12356;", "i"); kana("&#12358;", "u"); kana("&#12360;", "e"); kana("&#12362;", "o");
	nbsp2();
	kana("&#12363;", "ka"); kana("&#12365;", "ki"); kana("&#12367;", "ku"); kana("&#12369;", "ke"); kana("&#12371;", "ko");
	nbsp2()
	kana("&#12373;", "sa"); kana("&#12375;", "shi"); kana("&#12377;", "su"); kana("&#12379;", "se"); kana("&#12381;", "so");
	br();
	kana("&#12383;", "ta"); kana("&#12385;", "chi"); kana("&#12388;", "tsu"); kana("&#12390;", "te"); kana("&#12392;", "to");
	nbsp2();
	kana("&#12394;", "na"); kana("&#12395;", "ni"); kana("&#12396;", "nu"); kana("&#12397;", "ne"); kana("&#12398;", "no");
	nbsp2();
	kana("&#12399;", "ha"); kana("&#12402;", "hi"); kana("&#12405;", "fu"); kana("&#12408;", "he"); kana("&#12411;", "ho");
	br();
	kana("&#12414;", "ma"); kana("&#12415;", "mi"); kana("&#12416;", "mu"); kana("&#12417;", "me"); kana("&#12418;", "mo");
	nbsp2();
	kana("&#12425;", "ra"); kana("&#12426;", "ri"); kana("&#12427;", "ru"); kana("&#12428;", "re"); kana("&#12429;", "ro");
	nbsp2();
	kana("&#12364;", "ga"); kana("&#12366;", "gi"); kana("&#12368;", "gu"); kana("&#12370;", "ge"); kana("&#12372;", "go");
	br();
	kana("&#12374;", "za"); kana("&#12376;", "ji"); kana("&#12378;", "zu"); kana("&#12380;", "ze"); kana("&#12382;", "zo");
	nbsp2();
	kana("&#12384;", "da"); kana("&#12376;", "ji"); kana("&#12389;", "(zu)"); kana("&#12391;", "de"); kana("&#12393;", "do");
	nbsp2();
	kana("&#12400;", "ba"); kana("&#12403;", "bi"); kana("&#12406;", "bu"); kana("&#12409;", "be"); kana("&#12412;", "bo");
	br();
	kana("&#12401;", "pa"); kana("&#12404;", "pi"); kana("&#12407;", "pu"); kana("&#12410;", "pe"); kana("&#12413;", "po");
	nbsp2();
	kana("&#12353;", "'a"); kana("&#12355;", "'i"); kana("&#12357;", "'u"); kana("&#12359;", "'e"); kana("&#12361;", "'o");
	nbsp2();
	kana("&#12420;", "ya"); kana("&#12422;", "yu"); kana("&#12424;", "yo");
	br();
	kana("&#12419;", "'ya"); kana("&#12421;", "'yu"); kana("&#12423;", "'yo");
	nbsp2();
	kana("&#12431;", "wa"); kana("&#12434;", "(w)o"); kana("&#12435;", "n");
	
	document.getElementById("divbuttons").innerHTML = Buttons_tmp;
}


/* Function that renders the katakana buttons */
function katakana()
{
	// Empties the temporary string
	Buttons_tmp = "";
	
	kana("&#12450;", "a"); kana("&#12452;", "i"); kana("&#12454;", "u"); kana("&#12456;", "e"); kana("&#12458;", "o");
	nbsp2();
	kana("&#12459;", "ka"); kana("&#12461;", "ki"); kana("&#12463;", "ku"); kana("&#12465;", "ke"); kana("&#12467;", "ko");
	nbsp2();
	kana("&#12469;", "sa"); kana("&#12471;", "shi"); kana("&#12473;", "su"); kana("&#12475;", "se"); kana("&#12477;", "so");
	br();
	kana("&#12479;", "ta"); kana("&#12481;", "chi"); kana("&#12484;", "tsu"); kana("&#12486;", "te"); kana("&#12488;", "to");
	nbsp2();
	kana("&#12490;", "na"); kana("&#12491;", "ni"); kana("&#12492;", "nu"); kana("&#12493;", "ne"); kana("&#12494;", "no");
	nbsp2();
	kana("&#12495;", "ha"); kana("&#12498;", "hi"); kana("&#12501;", "fu"); kana("&#12504;", "he"); kana("&#12507;", "ho");
	br();
	kana("&#12510;", "ma"); kana("&#12511;", "mi"); kana("&#12512;", "mu"); kana("&#12513;", "me"); kana("&#12514;", "mo");
	nbsp2();
	kana("&#12521;", "ra"); kana("&#12522;", "ri"); kana("&#12523;", "ru"); kana("&#12524;", "re"); kana("&#12525;", "ro");
	nbsp2();
	kana("&#12460;", "ga"); kana("&#12462;", "gi"); kana("&#12464;", "gu"); kana("&#12466;", "ge"); kana("&#12468;", "go");
	br();
	kana("&#12470;", "za"); kana("&#12472;", "ji"); kana("&#12474;", "zu"); kana("&#12476;", "ze"); kana("&#12478;", "zo");
	nbsp2();
	kana("&#12480;", "da"); kana("&#12472;", "ji"); kana("&#12485;", "(zu)"); kana("&#12487;", "de"); kana("&#12489;", "do");
	nbsp2();
	kana("&#12496;", "ba"); kana("&#12499;", "bi"); kana("&#12502;", "bu"); kana("&#12505;", "be"); kana("&#12508;", "bo");
	br();
	kana("&#12497;", "pa"); kana("&#12500;", "pi"); kana("&#12503;", "pu"); kana("&#12506;", "pe"); kana("&#12509;", "po");
	nbsp2();
	kana("&#12449;", "'a"); kana("&#12451;", "'i"); kana("&#12453;", "'u"); kana("&#12455;", "'e"); kana("&#12457;", "'o");
	nbsp2();
	kana("&#12516;", "ya"); kana("&#12518;", "yu"); kana("&#12520;", "yo");
	br();
	kana("&#12515;", "'ya"); kana("&#12517;", "'yu"); kana("&#12519;", "'yo");
	nbsp2();
	kana("&#12527;", "wa"); kana("&#12530;", "(w)o"); kana("&#12531;", "n");
	
	document.getElementById("divbuttons").innerHTML = Buttons_tmp;
}


/* Function that replaces the roman letters for their corresponding kana */
function replacekana()
{
	// Temporary variable, for efficiency
	str = document.getElementById("k_textarea").value;
	
	
	/*---HIRAGANA; KATAKANA;---*/
	
	// l=r
	str = str.replace("l","r");	str = str.replace("L","R");
	
	/* little tsu */
	// by putting a 't' before:
	str = str.replace("tk","\u3063k");	str = str.replace("TK","\u30C3K");
	// [ts] wouldn't work because of [tsu]
	str = str.replace("tt","\u3063t");	str = str.replace("TT","\u30C3T");
	str = str.replace("tn","\u3063n");	str = str.replace("TN","\u30C3N");
	str = str.replace("th","\u3063h");	str = str.replace("TH","\u30C3H");
	str = str.replace("tm","\u3063m");	str = str.replace("TM","\u30C3M");
	str = str.replace("ty","\u3063y");	str = str.replace("TY","\u30C3Y");
	str = str.replace("tr","\u3063r");	str = str.replace("TR","\u30C3R");
	str = str.replace("tw","\u3063w");	str = str.replace("TW","\u30C3W");
	str = str.replace("tg","\u3063g");	str = str.replace("TG","\u30C3G");
	str = str.replace("tz","\u3063z");	str = str.replace("TZ","\u30C3Z");
	str = str.replace("td","\u3063d");	str = str.replace("TD","\u30C3D");
	str = str.replace("tb","\u3063b");	str = str.replace("TB","\u30C3B");
	str = str.replace("tf","\u3063f");	str = str.replace("TF","\u30C3F");
	str = str.replace("tp","\u3063p");	str = str.replace("TP","\u30C3P");
	str = str.replace("tj","\u3063j");	str = str.replace("TJ","\u30C3J");
	// by repeating consonants:
	str = str.replace("kk","\u3063k");	str = str.replace("KK","\u30C3K");
	str = str.replace("ss","\u3063s");	str = str.replace("SS","\u30C3S");
	// str = str.replace("tt","\u3063t"); // Already taken care of
	//str = str.replace("nn","\u3063n");	str = str.replace("NN","\u30C3N");
	str = str.replace("hh","\u3063h");	str = str.replace("HH","\u30C3H");
	str = str.replace("mm","\u3063m");	str = str.replace("MM","\u30C3M");
	str = str.replace("yy","\u3063y");	str = str.replace("YY","\u30C3Y");
	str = str.replace("rr","\u3063r");	str = str.replace("RR","\u30C3R");
	str = str.replace("ww","\u3063w");	str = str.replace("WW","\u30C3W");
	str = str.replace("gg","\u3063g");	str = str.replace("GG","\u30C3G");
	str = str.replace("zz","\u3063z");	str = str.replace("ZZ","\u30C3Z");
	str = str.replace("dd","\u3063d");	str = str.replace("DD","\u30C3D");
	str = str.replace("bb","\u3063b");	str = str.replace("BB","\u30C3B");
	str = str.replace("ff","\u3063f");	str = str.replace("FF","\u30C3F");
	str = str.replace("pp","\u3063p");	str = str.replace("PP","\u30C3P");
	str = str.replace("jj","\u3063j");	str = str.replace("JJ","\u30C3J");
		
	// ka
	str = str.replace("ka","\u304B");	str = str.replace("KA","\u30AB");
	str = str.replace("ki","\u304D");	str = str.replace("KI","\u30AD");
	str = str.replace("ku","\u304F");	str = str.replace("KU","\u30AF");
	str = str.replace("ke","\u3051");	str = str.replace("KE","\u30B1");
	str = str.replace("ko","\u3053");	str = str.replace("KO","\u30B3");
		
	// ta
	str = str.replace("ta","\u305F");	str = str.replace("TA","\u30BF");
	str = str.replace("chi","\u3061");	str = str.replace("CHI","\u30C1");
	str = str.replace("ti","\u3066\u3043");	str = str.replace("TI","\u30C6\u30A3");
	str = str.replace("tsu","\u3064");	str = str.replace("TSU","\u30C4");
	str = str.replace("te","\u3066");	str = str.replace("TE","\u30C6");
	str = str.replace("to","\u3068");	str = str.replace("TO","\u30C8");
		
	// sa (after ta because of [tsu], that would render t[su])
	str = str.replace("sa","\u3055");	str = str.replace("SA","\u30B5");
	str = str.replace("si","\u3057");	str = str.replace("SI","\u30B7");
	str = str.replace("shi","\u3057");	str = str.replace("SHI","\u30B7");
	str = str.replace("su","\u3059");	str = str.replace("SU","\u30B9");
	str = str.replace("se","\u305B");	str = str.replace("SE","\u30BB");
	str = str.replace("so","\u305D");	str = str.replace("SO","\u30BD");
		
	// na
	str = str.replace("na","\u306A");	str = str.replace("NA","\u30CA");
	str = str.replace("ni","\u306B");	str = str.replace("NI","\u30CB");
	str = str.replace("nu","\u306C");	str = str.replace("NU","\u30CC");
	str = str.replace("ne","\u306D");	str = str.replace("NE","\u30CD");
	str = str.replace("no","\u306E");	str = str.replace("NO","\u30CE");
		
	// ma
	str = str.replace("ma","\u307E");	str = str.replace("MA","\u30DE");
	str = str.replace("mi","\u307F");	str = str.replace("MI","\u30DF");
	str = str.replace("mu","\u3080");	str = str.replace("MU","\u30E0");
	str = str.replace("me","\u3081");	str = str.replace("ME","\u30E1");
	str = str.replace("mo","\u3082");	str = str.replace("MO","\u30E2");
		
	// ra
	str = str.replace("ra","\u3089");	str = str.replace("RA","\u30E9");
	str = str.replace("ri","\u308A");	str = str.replace("RI","\u30EA");
	str = str.replace("ru","\u308B");	str = str.replace("RU","\u30EB");
	str = str.replace("re","\u308C");	str = str.replace("RE","\u30EC");
	str = str.replace("ro","\u308D");	str = str.replace("RO","\u30ED");
		
	// ga
	str = str.replace("ga","\u304C");	str = str.replace("GA","\u30AC");
	str = str.replace("gi","\u304E");	str = str.replace("GI","\u30AE");
	str = str.replace("gu","\u3050");	str = str.replace("GU","\u30B0");
	str = str.replace("ge","\u3052");	str = str.replace("GE","\u30B2");
	str = str.replace("go","\u3054");	str = str.replace("GO","\u30B4");
		
	// da (before za because of ['ji] and ['zu])
	str = str.replace("da","\u3060");	str = str.replace("DA","\u30C0");
	str = str.replace("'ji","\u3062");	str = str.replace("'JI","\u30C2");
	str = str.replace("di","\u3062");	str = str.replace("DI","\u30C2");
	str = str.replace("'zu","\u3065");	str = str.replace("'ZU","\u30C5");
	str = str.replace("du","\u3065");	str = str.replace("DU","\u30C5");
	str = str.replace("de","\u3067");	str = str.replace("DE","\u30C7");
	str = str.replace("do","\u3069");	str = str.replace("DO","\u30C9");
		
	// za
	str = str.replace("za","\u3056");	str = str.replace("ZA","\u30B6");
	str = str.replace("zi","\u3058");	str = str.replace("ZI","\u30B8");
	str = str.replace("ji","\u3058");	str = str.replace("JI","\u30B8");
	str = str.replace("zu","\u305A");	str = str.replace("ZU","\u30BA");
	str = str.replace("ze","\u305C");	str = str.replace("ZE","\u30BC");
	str = str.replace("zo","\u305E");	str = str.replace("ZO","\u30BE");
		
	// ba
	str = str.replace("ba","\u3070");	str = str.replace("BA","\u30D0");
	str = str.replace("bi","\u3073");	str = str.replace("BI","\u30D3");
	str = str.replace("bu","\u3076");	str = str.replace("BU","\u30D6");
	str = str.replace("be","\u3079");	str = str.replace("BE","\u30D9");
	str = str.replace("bo","\u307C");	str = str.replace("BO","\u30DC");
		
	// pa
	str = str.replace("pa","\u3071");	str = str.replace("PA","\u30D1");
	str = str.replace("pi","\u3074");	str = str.replace("PI","\u30D4");
	str = str.replace("pu","\u3077");	str = str.replace("PU","\u30D7");
	str = str.replace("pe","\u307A");	str = str.replace("PE","\u30DA");
	str = str.replace("po","\u307D");	str = str.replace("PO","\u30DD");
		
	// wa
	str = str.replace("wa","\u308F");	str = str.replace("WA","\u30EF");
	str = str.replace("wo","\u3092");	str = str.replace("WO","\u30F2");
		
	/* n */
	// by putting a 'n' before
	str = str.replace("nk","\u3093k");	str = str.replace("NK","\u30F3K");
	str = str.replace("ns","\u3093s");	str = str.replace("NS","\u30F3S");
	str = str.replace("nt","\u3093t");	str = str.replace("NT","\u30F3T");
	str = str.replace("nn","\u3093n");	str = str.replace("NN","\u30F3N");
	str = str.replace("nh","\u3093h");	str = str.replace("NH","\u30F3H");
	str = str.replace("nm","\u3093m");	str = str.replace("NM","\u30F3M");
 	// [ny] wouldn't work because of [nya]
	str = str.replace("nr","\u3093r");	str = str.replace("NR","\u30F3R");
	str = str.replace("nw","\u3093w");	str = str.replace("MW","\u30F3W");
	str = str.replace("ng","\u3093g");	str = str.replace("NG","\u30F3G");
	str = str.replace("nz","\u3093z");	str = str.replace("NZ","\u30F3Z");
	str = str.replace("nd","\u3093d");	str = str.replace("ND","\u30F3D");
	str = str.replace("nj","\u3093j");	str = str.replace("NJ","\u30F3J");
	str = str.replace("nb","\u3093b");	str = str.replace("NB","\u30F3B");
	str = str.replace("np","\u3093p");	str = str.replace("NP","\u30F3P");
	// special character combinations
	str = str.replace("ñ","\u3093");	str = str.replace("Ñ","\u30F3");
	str = str.replace("ç","\u3093");	str = str.replace("Ç","\u30F3");
	str = str.replace("'n","\u3093");	str = str.replace("'N","\u30F3");
	str = str.replace("n'","\u3093");	str = str.replace("'N","\u30F3");
	str = str.replace("n ","\u3093");	str = str.replace("N ","\u30F3");
		
	// fa
	str = str.replace("fa","\u3075\u3041");	str = str.replace("FA","\u30D5\u30A1");
	str = str.replace("fi","\u3075\u3043");	str = str.replace("FI","\u30D5\u30A3");
	str = str.replace("fe","\u3075\u3047");	str = str.replace("FE","\u30D5\u30A7");
	str = str.replace("fo","\u3075\u3049");	str = str.replace("FO","\u30D5\u30A9");
		
	// ja
	str = str.replace("ja","\u3058\u3041");	str = str.replace("JA","\u30B8\u30A1");
	str = str.replace("ju","\u3058\u3045");	str = str.replace("JU","\u30B8\u30A5");
	str = str.replace("je","\u3058\u3047");	str = str.replace("JE","\u30B8\u30A7");
	str = str.replace("jo","\u3058\u3049");	str = str.replace("JO","\u30B8\u30A9");
		
	// kya
	str = str.replace("kya","\u304D\u3083");	str = str.replace("KYA","\u30AD\u30E3");
	str = str.replace("kyu","\u304D\u3085");	str = str.replace("KYU","\u30AD\u30E5");
	str = str.replace("kyo","\u304D\u3087");	str = str.replace("KYO","\u30AD\u30E7");
		
	// sha
	str = str.replace("sha","\u3057\u3083");	str = str.replace("SHA","\u30B7\u30E3");
	str = str.replace("shu","\u3057\u3085");	str = str.replace("SHU","\u30B7\u30E5");
	str = str.replace("sho","\u3057\u3087");	str = str.replace("SHO","\u30B7\u30E7");
		
	// cha
	str = str.replace("cha","\u3061\u3083");	str = str.replace("CHA","\u30C1\u30E3");
	str = str.replace("chu","\u3061\u3085");	str = str.replace("CHU","\u30C1\u30E5");
	str = str.replace("cho","\u3061\u3087");	str = str.replace("CHO","\u30C1\u30E7");
		
	// nya
	str = str.replace("nya","\u306B\u3083");	str = str.replace("NYA","\u30CB\u30E3");
	str = str.replace("nyu","\u306B\u3085");	str = str.replace("NYU","\u30CB\u30E5");
	str = str.replace("nyo","\u306B\u3087");	str = str.replace("NYO","\u30CB\u30E7");
		
	// hya
	str = str.replace("hya","\u3072\u3083");	str = str.replace("HYA","\u30D2\u30E3");
	str = str.replace("hyu","\u3072\u3085");	str = str.replace("HYU","\u30D2\u30E5");
	str = str.replace("hyo","\u3072\u3087");	str = str.replace("HYO","\u30D2\u30E7");
		
	// mya
	str = str.replace("mya","\u307F\u3083");	str = str.replace("MYA","\u30DF\u30E3");
	str = str.replace("myu","\u307F\u3085");	str = str.replace("MYU","\u30DF\u30E5");
	str = str.replace("myo","\u307F\u3087");	str = str.replace("MYO","\u30DF\u30E7");
		
	// rya
	str = str.replace("rya","\u308A\u3083");	str = str.replace("RYA","\u30EA\u30E3");
	str = str.replace("ryu","\u308A\u3085");	str = str.replace("RYU","\u30EA\u30E5");
	str = str.replace("ryo","\u308A\u3087");	str = str.replace("RYO","\u30EA\u30E7");
		
	// gya
	str = str.replace("gya","\u304E\u3083");	str = str.replace("GYA","\u30AE\u30E3");
	str = str.replace("gyu","\u304E\u3085");	str = str.replace("GYU","\u30AE\u30E5");
	str = str.replace("gyo","\u304E\u3087");	str = str.replace("GYO","\u30AE\u30E7");
		
	// zya
	str = str.replace("zya","\u3058\u3083");	str = str.replace("ZYA","\u30B8\u30E3");
	str = str.replace("zyu","\u3058\u3085");	str = str.replace("ZYU","\u30B8\u30E5");
	str = str.replace("zyo","\u3058\u3087");	str = str.replace("ZYO","\u30B8\u30E7");
		
	// bya
	str = str.replace("bya","\u3073\u3083");	str = str.replace("BYA","\u30D3\u30E3");
	str = str.replace("byu","\u3073\u3085");	str = str.replace("BYU","\u30D3\u30E5");
	str = str.replace("byo","\u3073\u3087");	str = str.replace("BYO","\u30D3\u30E7");
		
	// pya
	str = str.replace("pya","\u3074\u3083");	str = str.replace("PYA","\u30D4\u30E3");
	str = str.replace("pyu","\u3074\u3085");	str = str.replace("PYU","\u30D4\u30E5");
	str = str.replace("pyo","\u3074\u3087");	str = str.replace("PYO","\u30D4\u30E7");
		
 	// ha (at the end because of [sha] and [cha])
	str = str.replace("ha","\u306F");	str = str.replace("HA","\u30CF");
	str = str.replace("hi","\u3072");	str = str.replace("HI","\u30D2");
	str = str.replace("fu","\u3075");	str = str.replace("FU","\u30D5");
	str = str.replace("hu","\u3075");	str = str.replace("HU","\u30D5");
	str = str.replace("he","\u3078");	str = str.replace("HE","\u30D8");
	str = str.replace("ho","\u307B");	str = str.replace("HO","\u30DB");
		
	// ya
	str = str.replace("ya","\u3084");	str = str.replace("YA","\u30E4");
	str = str.replace("yu","\u3086");	str = str.replace("YU","\u30E6");
	str = str.replace("yo","\u3088");	str = str.replace("YO","\u30E8");
		
	// vowel
	str = str.replace("a","\u3042");	str = str.replace("A","\u30A2");
	str = str.replace("i","\u3044");	str = str.replace("I","\u30A4");
	str = str.replace("u","\u3046");	str = str.replace("U","\u30A6");
	str = str.replace("e","\u3048");	str = str.replace("E","\u30A8");
	str = str.replace("o","\u304A");	str = str.replace("O","\u30AA");
		
		
 	// Consonant by itself => consonant with an 'u' (I'm yet to find a way of making this work...)
	/*	
	   str = str.replace("k","\u304F");
	   str = str.replace("s","\u3059");
	   str = str.replace("t","\u3068");
	   str = str.replace("n","\u3093");
	   str = str.replace("m","\u3080");
	   str = str.replace("r","\u308B");
	   str = str.replace("g","\u3050");
	   str = str.replace("z","\u305A");
	   str = str.replace("d","\u3065");
	   str = str.replace("b","\u3076");
	   str = str.replace("p","\u3077");
	 */
	
	/*---Other Characters---*/
	str = str.replace(",","\u3001"); // comma
	str = str.replace(".","\u3002"); // period
	
	// Simple quote
 	//str = str.replace("' ","\u300C");
	//str = str.replace(" '","\u300D");
 	str = str.replace("[","\u300C");
	str = str.replace("]","\u300D");
	
	// Double quotes
 	str = str.replace("\" ","\u300E");
	str = str.replace(" \"","\u300F");
	
	
	
	// Braces
	str = str.replace("{","\uFF5B"); // {
	str = str.replace("}","\uFF5D"); // }
	
	// Parentheses
	str = str.replace("(","\uFF08"); // (
	str = str.replace(")","\uFF09"); // )
	
	// Square brackets (used for quotes)
	//str = str.replace("[","\uFF3B"); // [
	//str = str.replace("]","\uFF3D"); // ]
	
	// Lenticular brackets
	str = str.replace("<","\u3010");
	str = str.replace(">","\u3011");
	
	
	str = str.replace("-","\u30FC"); // long vowel mark
	str = str.replace("!","\uFF01"); // exclamation mark
	str = str.replace("*","\uFF0A"); // asterisk
	str = str.replace("?","\uFF1F"); // question mark
	str = str.replace("@","\uFF20"); // at sign 
	//str = str.replace("~","\uFF5E"); // tilde
	str = str.replace("~","\u301C"); // tilde
	
	
	// Puts the temporary variable inside of the textbox
	document.getElementById("k_textarea").value = str;
}
