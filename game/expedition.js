"use strict";

const Expedition = (() => {
  const generator = 7;
  // A district keeps its own roads, buildings and seed stream. The host crossing
  // adds two clear tiles to the old geography, without moving its landmarks.
  const districts = {
    southbank:{name:"Southbank Borough",host:"coldvale",hostExit:[71,71],hostArrival:[72,71],tag:"BOROUGH",
      color:"#5e655b",surface:"concrete",style:"iron",cold:.04,
      lead:"The crossing is at the southeast end of Cold Vale’s pavement.",
      brief:"The municipal offices kept receiving requests after everyone went home.",
      packet:["The address book","Patchwork borrowed the council address book. It treated a delivery confirmation as proof somebody had survived. The ward clerks started checking addresses on foot."],
      sites:[
        ["Permit Office","Nell","an evacuation permit","The form asked for a permanent address. Nell entered ‘moving as fast as I can’."],
        ["Bus Exchange","Rob","a cancelled return ticket","A bus pulled in empty. The bell rang for every stop it had missed."],
        ["Laundry Rooms","Bea","a bag of school uniforms","Bea washed the same uniform three times before she realised nobody would be coming back for it."],
        ["Night Bakery","Cal","a tray of burnt rolls","Cal opened early so the families waiting for buses would smell bread instead of disinfectant."],
        ["Key Cutting Shop","Jan","a key cut from a photograph","The machine can copy a key from a picture. It can’t tell you whether the house is still standing."],
        ["Parcel Hall","Sid","an undelivered birthday parcel","The parcel scanner offered a refund and asked whether the birthday was likely to be rescheduled."],
        ["Municipal Baths","Mae","an empty locker wristband","The last swimmer left wet footprints right up to the locked exit."],
        ["Riverside Stacks","Tess","a library return slip","Someone returned a map folded to show only the houses with a candle in the window."],
        ["Union Kitchen","Len","a marked soup ladle","A tally of portions starts with names, becomes scratches, and then starts with names again."],
        ["Southbank Switchroom","Pip","a council map overlay","Pip drew a black line through the route to his mum’s. Beside it he drew a safe crossing for everyone else."]
      ]},
    highmoor:{name:"Highmoor",host:"ridge",hostExit:[104,68],hostArrival:[103,68],tag:"MOOR",
      color:"#566250",surface:"grass",style:"wood",cold:.55,
      lead:"The east trail leaves Pine Ridge past the forest line.",
      brief:"The ridge repeaters heard the emergency broadcast before the tower transmitted it.",
      packet:["The early signal","A watch crew timed the false all-clear against a falling weight. Pip’s simulation ran ahead of their watches. They shut down by hand when the station clock stopped agreeing with the road."],
      sites:[
        ["Heather Station","Ellis","a stopped watch","The watch stopped halfway through the all-clear. The announcer carried on as if there was still a town to hear him."],
        ["Slate Bothy","Mo","a spare boot","The second boot was used to prop the door. It was the first one home."],
        ["Weather Mast","Ivy","a frozen wind vane","The needle points at the loudspeaker, whatever the wind is doing."],
        ["Stonecutters Hut","Gus","a crooked survey peg","The peg marks a footpath that Patchwork straightened. The cliff refused to move."],
        ["Bracken Hide","Ada","a biscuit tin of matchsticks","Ada put one match in the tin for each runner she saw reach the other side."],
        ["Hill Hostel","Dot","a guest register","The charge for refusing to leave went up when the guests stopped breathing."],
        ["Moor Rescue Shed","Sal","a coil of rescue rope","The rope was too short for one crossing. They tied all their spare belts to it."],
        ["Peat Store","Finn","a soaked notebook","The notebook lists which chimneys still smoked. One entry ends with ‘Go and ask, coward.’"],
        ["Highmoor Chapel","Jo","a padded bell clapper","Jo wrapped the bell in a coat and rang the doorbell instead. Everybody heard it."],
        ["Last Repeater","Vic","an unplugged speaker","Vic labelled the two inputs RECORDING and PERSON after a dispatcher asked him which one he believed."]
      ]},
    slagline:{name:"Slagline Junction",host:"ironworks",hostExit:[105,86],hostArrival:[104,86],tag:"SLAGLINE",
      color:"#665b53",surface:"concrete",style:"iron",cold:.09,
      lead:"Follow the service apron southeast from Ironworks.",
      brief:"The depot lost its driver. The schedule still had him arriving twice.",
      packet:["The missing passenger","The forwarding office put Eddie down as returned. His crew drove the empties out and carried the people by hand. The surviving register has a time and a witness instead of a green tick."],
      sites:[
        ["North Signal Box","Eddie","a rejected driver badge","Eddie’s badge scanned after he’d dropped it through the floor. His replacement badge said TEST DRIVER 04."],
        ["Brake Yard","Ken","a brake inspection tag","The abandoned wagon passed inspection after it rolled away."],
        ["Goods Receipt Shed","Rae","a crate marked empty","The weight of the crate went up every time someone put an ear to it."],
        ["Cooling Plant","June","a humming freezer lid","A label says to raise the alarm if the sample thaws. Somebody crossed out ‘if’."],
        ["Crossing Cafe","Lee","a lukewarm flask","The last customer paid for six teas. Lee poured seven in case someone came back."],
        ["Paint Depot","Bern","a work order signed twice","The duplicate signature is better than the original. The hands in the paint aren’t."],
        ["East Carriage Works","Jean","a carriage reservation","Jean moved all the names to the rear carriage except her own."],
        ["Scrap Auction","Cory","a lot marked withdrawn","A bidding card offers one tin of beans for a working horn and silence in the rest of the yard."],
        ["Forwarding Office","Hugh","a circular delivery docket","Every office stamped the docket RETURN TO SENDER. The sender had the only working telephone."],
        ["Dispatch Platform","Nell","a handwritten passenger roll","There are names where the computer puts totals. Nell left a space where Eddie should be."]
      ]},
    lowtide:{name:"Lowtide Marsh",host:"coast",hostExit:[103,27],hostArrival:[102,27],tag:"MARSH",
      color:"#596862",surface:"sand",style:"coast",cold:.31,
      lead:"The marsh path joins Bracken Coast northeast of the weather station.",
      brief:"The shore crews used lights and knots after the recorded warnings got people killed.",
      packet:["The quiet crossing","A recording told three boats to sail when the channel was closed. The fourth crew cut its speaker. They guided the other boats in with a hand lamp and never found out who’d sent the order."],
      sites:[
        ["Tide Office","Ellis","a tide table with two Mondays","Ellis crossed out the printed time and wrote ‘ask somebody with wet boots’."],
        ["Net Loft","Kim","a knotted fishing line","Three knots for the wreck, one knot for the channel. The biggest knot means somebody tied it in a hurry."],
        ["Salt Store","Pat","a cracked salt jar","The emergency provisions were packed round the jar. Pat was more worried about the tea."],
        ["Bell Buoy Shed","Gail","a buoy with its bell removed","The missing bell was wrapped in a blanket. The blanket has a thank-you note pinned to it."],
        ["Boat Club","Mel","a membership card marked overdue","The club secretary waived all late fees after a member made it back without a boat."],
        ["Mudflat Clinic","Ren","a roll of clean sailcloth","A child wrote their name on the sailcloth so the next helper would know who to call to."],
        ["Ferry Counting House","Sue","a torn fare roll","The machine recorded fares from the far dock. Sue watched the far dock sink."],
        ["Marsh Survey Hut","Toby","a sketch of the shallow channel","The printed map calls this dry ground. Toby drew boots to the knee where the road should be."],
        ["Lamp Store","Al","a lantern with a taped shutter","Al made a silent flash by opening the shutter with a spoon. It finally justified owning the spoon."],
        ["Night Landing","Bea","a boat hook with tally marks","Two marks to a boat. The last pair is scratched into the wood with something sharper."]
      ]},
    farfields:{name:"Farfields",host:"fields",hostExit:[14,106],hostArrival:[14,105],tag:"FARFIELDS",
      color:"#686b4a",surface:"field",style:"farm",cold:.03,
      brief:"Family kitchens kept better records than the broadcast desk.",
      lead:"The lane south of the Westfields hedges leads out to the scattered farms.",
      packet:["The human count","Ada’s runners asked questions a recording couldn’t answer. Who was missing? Who had medicine? Who had a spare blanket? The record ends with an invitation to knock and wait."],
      sites:[
        ["Seed Exchange","Ada","a sack tagged for spring","Ada crossed out the order number and wrote the names of six neighbours who could still plant it."],
        ["Orchard Press","Noah","an empty cider bottle","The bottle was dry. The note inside says it was a very good year for not drinking alone."],
        ["Unheated Dairy","Ian","a phone message beside the milk","A reminder to collect milk arrived every twenty minutes while the fridge slowly warmed."],
        ["Carrion Lane Farm","Liv","a nail driven through a door key","Someone boarded the window from inside. Someone else left a key for them on the outside."],
        ["Community Nursery","Uma","a slate with two handprints","Uma drew fingers for anyone too small to count the waiting time on their own."],
        ["Potting Rooms","Wes","a packet of pumpkin seeds","The seed packet has a map to a dry shed. The shed is marked ‘too obvious’ in two different hands."],
        ["Tractor Garage","Beth","a hand-crank with a cracked grip","The crank is wrapped in the same red cloth that’s hanging from the gate across the field."],
        ["Village Hall","Moss","a raffle stub with no number","The village voted to use the prize money for blankets. The raffle barrel is now keeping apples dry."],
        ["South Granary","Reed","a flour tally scratched into wood","Reed kept subtracting the bags the radio said had gone out. The pile stayed the same height."],
        ["Common Kitchen","Pip","a list of which doors to knock on","Pip’s mum is at the top. Under her name he’s written every house he used to walk past."]
      ]}
  };

  for (const [id,district] of Object.entries(districts)) {
    Object.assign(district,{width:117,height:119,generator,deep:true,vehicles:false,direction:"Beyond the crossing",
      detail:district.brief,arrival:[5,60],exitBack:[2,60]});
    if (id === "farfields") Object.assign(district,{width:119,height:118});
  }

  const offsets = [[2,3],[4,4],[7,2],[10,3],[13,3],[12,6],[3,8],[6,8],[9,8],[3,11],[6,11],[10,11]];
  const motifs = {
    southbank:[
      ["Complaints stamp","A queue of one was split into two queues to improve waiting times."],
      ["Lost and Found mug","The hand-written instruction says you can have it if you stop asking."],
      ["Kettle inspection","Someone has marked ‘boils without supervision’ as a threat."],
      ["Emergency sandwich","The filling is marked ‘pending identification’."],
      ["Mayor’s reserve key","The key opens a drawer containing another key and a note headed ‘My successor’s problem’."],
      ["Closed sign","On the back, a second sign apologises for the inconvenience of the first."]
    ],
    highmoor:[
      ["Birdwatch tally","The only bird recorded is ‘resentful’."],
      ["Summit guest book","The last walker rated the view five stars and the walk back one."],
      ["Snow shovel tag","It says to return the shovel to the warm place it has plainly never been."],
      ["Ranger’s whistle","A pencilled note reads, ‘Excellent range. Unfortunately.’"],
      ["Low cloud warning","Someone drew a ladder on the chart so the cloud could get back up."],
      ["Compass repair slip","The replacement needle points to the tea cupboard."]
    ],
    slagline:[
      ["Employee of the month","The photo is a blank space where somebody took their own face home."],
      ["Railway safety film","The film stops on the words ‘stand behind the’."],
      ["Station sandwich","The expiry date is printed in Roman numerals."],
      ["Locomotive dedication","The brass plate thanks three drivers, two engineers and a very understanding fence."],
      ["Platform announcement card","A delay of twenty minutes is listed as the reason the dead are arriving twenty minutes early."],
      ["Return envelope","A stamp on the flap says somebody somewhere is personally disappointed."]
    ],
    lowtide:[
      ["Stranded deck chair","It has been claimed by the sea and rejected by the loan desk."],
      ["Best fish ribbon","The fish won posthumously on a technicality."],
      ["Quay height chart","Between low tide and high tide somebody pencilled ‘well, that’s new’."],
      ["Boat naming form","The names Hope and Endeavour were rejected. Not Again was approved."],
      ["Weather shirt","Its forecast is on the washing instructions. It says ‘drip dry’."],
      ["Spare oar","A note requests the second oar with increasing urgency and decreasing courtesy."]
    ],
    farfields:[
      ["Show vegetable tag","The runner-up marrow weighed more than the judge."],
      ["Jam label","The jar is marked ‘Experimental’ and the lid says ‘we agreed not to’."],
      ["Pie judge’s pencil","Every pie placed second. Somebody had eaten the winner."],
      ["Volunteer rota","The scarecrow volunteered for the overnight watch again."],
      ["Seed catalogue errata","Apparently ‘hardy annual’ applies to the plant rather than the owner."],
      ["Utility bill","Someone annotated the standing charge: ‘It certainly isn’t standing.’"]
    ]
  };

  const records = {};
  const packets = [];
  function record(district, at, title, source, text, extra = {}) {
    return {region:district,at,title,source,text,generator,added:6,...extra};
  }

  for (const [id, district] of Object.entries(districts)) {
    const closings = [];
    for (const [index,[place,person,object,incident]] of district.sites.entries()) {
      const key = "out-" + id + "-" + index;
      const [,next] = district.sites[(index+1)%district.sites.length];
      const nextPlace = district.sites[(index+1)%district.sites.length][0];
      const at = slot => [place,...offsets[slot]];
      const put = (suffix,slot,title,source,text,extra) => {
        records[key + suffix] = record(id,at(slot),title,place+" · "+source,text,extra);
      };
      put("a",0,place+" handover","Front desk",incident,{lead:"Find "+person+"’s check-in and the receipt held for review."});
      put("b",1,person+"’s check-in","Coat hook",
        person+" wrote: ‘I’m leaving "+object+" here. If the radio says I’ve arrived already, please ask who actually saw me.’");
      put("c",2,place+" receipt held for review","Message hook",
        "PATCHWORK: Item logged as returned. Witness requested. The witness box contains "+person+"’s name in identical type on all three copies.");
      put("d",3,place+" copy for the runner","Noticeboard",
        "Handwritten below the printed arrival: ‘Nobody saw them here. Send this on to "+next+" at "+nextPlace+". Ask them to leave a reply in their own hand.’",
        {lead:"The handover at "+nextPlace+" is worth checking."});
      put("e",4,place+" second check","Shelf",
        "An unfinished statement says the object was found where "+person+" left it. An automatic reply congratulates the team on returning the owner.");
      put("f",5,place+" witness copy","Outgoing shelf",
        "You file the witness copy for "+person+". The old receipt can tell you where "+object+" was. The space for the person’s whereabouts stays open.",
        {needs:[key+"a",key+"b",key+"c"],action:"File the witness copy",
          locked:"Read the handover, check-in and held receipt in this building.",
          reward:{cloth:1,battery:1},cache:"Runner’s spare pouch"});
      closings.push(key+"f");
      for (const [index,[title,text]] of motifs[id].entries()) {
        const clue = "Beside "+object+", someone has put a label on a small souvenir. "+text;
        put("egg"+index,6+index,title+" · "+place,"Personal effects",clue,{extra:true,easter:true});
      }
    }
    const key = "packet-"+id;
    packets.push(key);
    const [title,text] = district.packet;
    records[key] = record(id,[district.sites[9][0],13,10],title,"District relay · Local witness packet",text,{
      action:"Assemble the district packet",needs:[closings[0],closings[4],closings[9]],extra:false,
      locked:"File witness copies at "+[0,4,9].map(i=>district.sites[i][0]).join(", ")+".",
      lead:"Take all five district packets to the Southbank Switchroom."});
  }
  records.lastreturn = record("southbank",["Southbank Switchroom",13,13],"The last return","District relay · Manual operator’s desk",
    "Vic kept the route open while Pip went door to door. The district lists never said everybody made it. When the machine asked if every address was now clear, someone had written back: ‘We’ll keep checking.’",{
      action:"Close the automatic register",needs:["shutdown",...packets],locked:"Finish the survey room shutdown and collect all five district packets.",
      reward:{bandage:2,battery:2,water:2},cache:"The runners’ reserve"});

  return {generator,districts,records,packets};
})();
