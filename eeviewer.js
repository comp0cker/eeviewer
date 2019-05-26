$(document).ready(function() {
    let deck = $(".deck").text();
    $(".deck").empty(); // flushes deck container

    let deckHtml = "<table style='display:inline-block'><tr><th>Pokemon</th><th>Trainers</th><th>Energy</th></tr>";

    // Append to lists
    let pokemon = [];
    let trainers = [];
    let energy = [];

    let cards = deck.split("\n");
    let mode = "";
    for (var i = 0; i < cards.length; i++) {
        cards[i] = cards[i].trim();

        if (cards[i] == "Pokemon") {
            mode = "Pokemon";
        }
        else if (cards[i] == "Trainers") {
            mode = "Trainers";
        }
        else if (cards[i] == "Energy") {
            mode = "Energy";
        }

        else {
            if (cards[i] != "") {
                if (mode == "Pokemon") {
                    pokemon.push(cards[i]);
                }
                if (mode == "Trainers") {
                    trainers.push(cards[i]);
                }
                if (mode == "Energy") {
                    energy.push(cards[i]);
                }
            }
        }
    }

    for (var i = 0; i < Math.max(pokemon.length, trainers.length, energy.length); i++) {
        let pkmn = "", trnr = "", enrgy = "";

        if (i < pokemon.length) {
            pkmn = pokemon[i];
        }
        if (i < trainers.length) {
            trnr = trainers[i];
        }
        if (i < energy.length) {
            enrgy = energy[i];
        }

        pkmn = "<div onmouseover='get_card(this)'>" + pkmn + "</div>";
        trnr = "<div onmouseover='get_card(this)'>" + trnr + "</div>";
        enrgy = "<div onmouseover='get_card(this)'>" + enrgy + "</div>";

        deckHtml += "<tr><td>" + pkmn + "</td><td>" + trnr + "</td><td>" + enrgy + "</td></tr>";
    }
    deckHtml += "</table><div class='pic' style='display:inline-block'></div>";

    $(".deck").html(deckHtml);
    
    //get_deck(deck);
});

function get_deck(input)
{
    var lines = input.split('\n');
    for(var i = 0; i < lines.length; i++){
        if (lines[i].trim() != "" && lines[i].trim() != "Pokemon" && lines[i].trim() != "Trainers" && lines[i].trim() != "Energy") {
            get_card(lines[i].trim());
        }
    }
}

function get_card(input)
{
    input = input.innerText;
    input = input.split(" GX").join("-GX");
    input = input.split(" EX").join("-EX");

    var count = get_count(input); // yeah rip the count variable (we might wanna do some cool stack effect tho)
    input = crop_count(input);
    var url = parse_input(input);
    console.log(url);

    $.ajax({
        async: false,
        url: url,
        success: function (data) {
            $(".pic").html("<img src='" + data.cards[0].imageUrl + "'height=" + "300px" + ">");
        }
    });
}

function parse_input(line)
{
    var url = "https://api.pokemontcg.io/v1/cards/?name=";

    var name = url_set_name(line).split(" ").join("+");
    name = name.split("&").join("%26"); // makes the & character searchable in the URL
    name = get_exceptions(name);        // applies the exceptions rule (so far just for Switch)
    url = url_add_set(url, line, name);

    return url;
}

function get_count(line){
    var card_count = 1;

    if (!isNaN(line.charAt(0)) && line.charAt(1) == " ")// if count is one digit number
        card_count = parseInt(line.substr(0, 1));

    else if (!isNaN(line.charAt(0)) && !isNaN(line.charAt(1)) && line.charAt(2) == " ") // if count is two digit number
        card_count = parseInt(line.substr(0, 2));

    // if else, card_count stays equal to 1

    return card_count;
}

function crop_count(line){
    if (!isNaN(line.charAt(0)) && line.charAt(1) == " ")// if count is one digit number
        return line.substr(2, line.length - 1);

    else if (!isNaN(line.charAt(0)) && !isNaN(line.charAt(1)) && line.charAt(2) == " ") // if count is two digit number
        return line.substr(3, line.length - 1);

    return line;
}

function url_add_set(url, line, name){
    var set;

    if (line.length >= 4 && line.charAt(line.length - 4) == " ") // if setCode is three characters long
    {
        set = line.substr(line.length - 3, 3);
        url += name + "&setCode=" + set_convert(set);
    }
    else if (line.length >= 3 && line.charAt(line.length - 3) == " ") // if setCode is four characters long
    {
        set = line.substr(line.length - 2, 2);
        url += name + "&setCode=" + set_convert(set);
    }
    else
    {
        url += name + url_name_exceptions(url, line);
    }

    return url;
}

function url_set_name(line){
    if (line.length >= 4 && line.charAt(line.length - 4) == " ") // if setCode is three characters long
        return (line.substr(0, line.length - 4));

    else if (line.length >= 3 && line.charAt(line.length - 3) == " ") // if setCode is four characters long
        return (line.substr(0, line.length - 3));

    return line;
}

function url_name_exceptions(url, line){
    if (line.charAt(0).toUpperCase() == "N" && line.length == 1) // if N
        return ("&id=xy10-105");
    if (line.includes("sycamore"))
        return ("&id=xy4-101");

    return "";
}

function get_exceptions(input){
    if (input == "Switch")
        return '"Switch"';
    else   
        return input
}

function set_convert(abbr){
    abbr = abbr.toUpperCase();

    if (abbr == "UNB")
        return "sm10"
    if (abbr == "TEU")
        return "sm9"
    if (abbr == "LOT" || abbr == "LST")
        return "sm8";
    if (abbr == "DRM")
        return "sm75"
    if (abbr == "CES")
        return "sm7"
    if (abbr == "FLI")
        return "sm6";
    if (abbr == "ULP")
        return "sm5";
    if (abbr == "CRI" || abbr == "CIN")
        return "sm4"
    if (abbr == "SHL")
        return "sm35";
    if (abbr == "BUR" || abbr == "BUS")
        return "sm3";
    if (abbr == "GRI" || abbr == "GUR")
        return "sm2";
    if (abbr == "EVO")
        return "xy12";
    if (abbr == "STS" || abbr == "STM")
        return "xy11";
    if (abbr == "FAC" || abbr == "FCO")
        return "xy10";
    if (abbr == "GEN")
        return "g1";
    if (abbr == "BKP" || abbr == "BRP")
        return "xy9";
    if (abbr == "BKT")
        return "xy8";
    if (abbr == "AOR")
        return "xy7";
    if (abbr == "ROS" || abbr == "RSK")
        return "xy6";
    if (abbr == "DCR")
        return "dc1";
    if (abbr == "PRC")
        return "xy5";
    if (abbr == "PHF")
        return "xy4";
    if (abbr == "FFI" || abbr == "FUF")
        return "xy3";
    if (abbr == "FLF")
        return "xy2";
    if (abbr == "XY")
        return "xy1";
    if (abbr == "KSS")
        return "xy0";
    if (abbr == "PR" || abbr == "PR-" || abbr == " XY")
        return "xyp";
    if (abbr == "LTR")
        return "bw11";
    if (abbr == "PLB")
        return "bw10";
    if (abbr == "PLF")
        return "bw9";
    if (abbr == "PLS")
        return "bw8";
    if (abbr == "BCR")
        return "bw7";
    if (abbr == "DRV")
        return "dv1";
    if (abbr == "DRX")
        return "bw6";
    if (abbr == "DEX")
        return "bw5";
    if (abbr == "NXD")
        return "bw4";
    if (abbr == "NVI")
        return "bw3";
    if (abbr == "EPO")
        return "bw2";
    if (abbr == "BLW" || abbr == "BW " || abbr == "BW" || abbr == " BW")
        return "bw1";
    if (abbr == "SM" || abbr == " SM" || abbr == "SM " || abbr == "SAM" || abbr == "SUM")
        return "sm1";
}