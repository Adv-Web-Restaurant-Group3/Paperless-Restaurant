function toggleIMG(divContent){
    if(divContent.includes("checked")){
        return '<img src="images/box.png">';
    }else{
        return '<img src="images/checked-box.png">';
    }
}
$(".orderItem").click(event=>{
    let itemImage = $(event.target).parent().find(".itemIMG");
    if(!$(event.target).find("img").length) itemImage = $(event.target).parent().parent().find(".itemIMG");
    itemImage.html(toggleIMG(itemImage.html()));
});

