var domain = "http://localhost:8080";

function gameEndedWithResult(value){
        console.log("game finished, sending " +  value + " as end points")
        window.parent.postMessage({"gameEnd":{"endPoints":value}}, domain)

        
}