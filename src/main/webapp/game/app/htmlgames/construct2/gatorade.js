
function gameEndedWithResult(value){
        console.log("game finished, sending " +  value + " as end points")
        window.parent.postMessage({"gameEnd":{"endPoints":value}}, "http://localhost:9000")

        
}