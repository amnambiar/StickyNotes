var jsonData = {};

$(window).load(function() {
    var a = localStorage.getItem("stickyData");
    if (a === null) {
        jsonData = {
            "sticky": []
        };
    } else {
        jsonData = JSON.parse(a);
        //append sticky at random locations
        for (var stickyId = 0; stickyId < jsonData.sticky.length; stickyId++) {
            $("#sticky_container").append("<div data-priority=" + jsonData.sticky[stickyId].priority + " class='sticky' id='sticky_id" + stickyId + "'  ondragstart='drag_start(event)' draggable=true >" +
                    "<header><h3>" + jsonData.sticky[stickyId].status + "</h3></header>" +
                    "<img class='sticky_status_icon' src='images/status.png'/>" +
                    "<select class='sticky_status' id='sticky_status" + stickyId + "'><option value='To Do'>To Do</option><option value='In Progress'>In Progress</option><option value='Completed'>Completed</option></select>" +
                    "<textarea class='sticky_text'>" + jsonData.sticky[stickyId].text + "</textarea/>" +
                    "<img class='close_button' id='sticky_id" + stickyId + "_close' src='images/closeButton.png'/>" +
                    "<div class='sticky_details'>" + jsonData.sticky[stickyId].lastVisited + "</div>" +
                    "<div class='sticky_priority'>" +
                    "<div data-preference='high' class='prio_color high_sticky'></div>" +
                    "<div data-preference='medium' class='prio_color medium_sticky'></div>" +
                    "<div data-preference='low' class='prio_color low_sticky'></div>" +
                    "</div>" +
                    "</div>");
            if (jsonData.sticky[stickyId].status === "Completed") {
                $("#sticky_id" + stickyId).css({
                    "left": "900px",
                    "top": Math.round(Math.random() * 250) + "px"
                });
            } else {
                $("#sticky_id" + stickyId).css({
                    "left": "85px",
                    "top": (jsonData.sticky.length - stickyId) * 30 + 'px',
                    "zIndex": (jsonData.sticky.length) - stickyId
                });
            }
        }
    }
});

$(document).ready(function() {
    var zIndex = 0,
            left = 0,
            stickyId = 0,
            top = 0,
            currentClickedSticky,
            changedCompleted = false;

    function randomGenerator() {
        left = Math.round(Math.random() * 1000) + 'px';
        top = Math.round(Math.random() * 250) + 'px';
        zIndex++;
        $("#sticky_id" + stickyId).css({
            "left": left,
            "top": top,
            "zIndex": zIndex
        });
    }

    function getCurrentTime(currenSticky) {
        var d = new Date(),
                time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        $("#" + currenSticky + " .sticky_details").html("Last Modified: " + time);
    }

    function rebuildStickyIds() {
        $("#sticky_container .sticky").each(function(index) {
            $(this).attr("id", "sticky_id" + index);
        });
    }

    function rebuildPriorityStickyId() {
        var stickyIndex = -1;
        $("#sticky_container .sticky[data-priority='high']").each(function() {
            stickyIndex++;
            $(this).attr("id", "sticky_id" + stickyIndex);
        });
        $("#sticky_container .sticky[data-priority='medium']").each(function() {
            stickyIndex++;
            $(this).attr("id", "sticky_id" + stickyIndex);
        });
        $("#sticky_container .sticky[data-priority='low']").each(function() {
            stickyIndex++;
            $(this).attr("id", "sticky_id" + stickyIndex);
        });
    }

    $("#reload_button").on("click", function() {
        location.reload();
    });

    $("#new_sticky_buttonwrap img").hover(function() {
        $("#new_sticky_buttonwrap").animate({
            width: 210
        }, 350);
        $("#new_sticky_buttonwrap span").css({
            width: "150px"
        }).show(1);
    }, function() {
        $("#new_sticky_buttonwrap").animate({
            width: 57
        }, 350);
        $("#new_sticky_buttonwrap span").css({
            width: "0px"
        }).hide(1);
    });

    $("#new_sticky_buttonwrap img").on("click", function() {
        $("#sticky_container").append("<div data-priority='medium' class='sticky' id='sticky_id" + stickyId + "'  ondragstart='drag_start(event)' draggable=true >" +
                "<header><h3>To Do</h3></header>" +
                "<img class='sticky_status_icon' src='images/status.png'/>" +
                "<select class='sticky_status' id='sticky_status" + stickyId + "'><option value='To Do'>To Do</option><option value='In Progress'>In Progress</option><option value='Completed'>Completed</option></select>" +
                "<textarea class='sticky_text'></textarea/>" +
                "<img class='close_button' id='sticky_id" + stickyId + "_close' src='images/closeButton.png'/>" +
                "<div class='sticky_details'></div>" +
                "<div class='sticky_priority'>" +
                "<div data-preference='high' class='prio_color high_sticky'></div>" +
                "<div data-preference='medium' class='prio_color medium_sticky'></div>" +
                "<div data-preference='low' class='prio_color low_sticky'></div>" +
                "</div>" +
                "</div>");
        randomGenerator();
        getCurrentTime("sticky_id" + stickyId);
        stickyId++;
    });

    $("#sticky_container").delegate(".sticky_status_icon", "click", function() {
        $("#" + $(this).parent().attr("id") + " .sticky_status").show(1);
    });

    $("#sticky_container").delegate(".sticky_status", "focus", function() {
        if ($(this).val() === "Completed") {
            changedCompleted = true;
        } else {
            changedCompleted = false;
        }
    });

    $("#sticky_container").delegate(".sticky_status", "change", function() {
        $("#" + $(this).parent().attr("id") + " h3").text($(this).val());
        if ($(this).val() === "Completed") {
            $("#" + $(this).parent().attr("id")).css({
                "left": "900px",
                "top": Math.round(Math.random() * 250) + "px"
            });
        }
        if (changedCompleted) {
            $("#" + $(this).parent().attr("id")).css({
                "left": Math.round(Math.random() * 1000) + "px",
                "top": Math.round(Math.random() * 250) + "px"
            });
        }
        $("#sticky_container #" + $(this).attr("id")).hide(1);
    });

    $("#sticky_container").delegate(".sticky_text", "keyup", function() {
        getCurrentTime(currentClickedSticky);
    });

    $("#sticky_container").delegate(".close_button", "click", function() {
        var id = $(this).parent().attr("id");
        $("#" + id).remove();
        rebuildStickyIds();
    });

    $("#sticky_container").delegate(".sticky", "click", function() {
        currentClickedSticky = $(this).attr("id");
        $("#" + currentClickedSticky + "_close").show(1);
        $(".sticky").each(function(index) {
            $(this).css("zIndex", ($(".sticky").length - index));
        });
        $("#" + currentClickedSticky).css("zIndex", $(".sticky").length + 1);
    });

    $("#sticky_container").delegate(".prio_color", "click", function() {
        var parentStickyId = $(this).parent().parent().attr("id");
        $("#" + parentStickyId).attr("data-priority", $(this).data("preference"));
    });

    $("#save_button").on("click", function() {
        var jsonDataIndex = -1;
        jsonData = {
            "sticky": []
        };
        rebuildPriorityStickyId();
        $("#sticky_container .sticky").each(function(i) {
            if (jsonData.sticky.length === 0) {
                jsonDataIndex++;
                jsonData.sticky[jsonDataIndex] = {
                    "id": "#sticky_id" + i,
                    "text": $("#sticky_id" + i + " .sticky_text").val(),
                    "priority": $("#sticky_id" + i).data("priority"),
                    "status": $("#sticky_id" + i + " .sticky_status").val(),
                    "lastVisited": $("#sticky_id" + i + " .sticky_details").text()
                };
            } else {
                for (var j = 0; j < jsonData.sticky.length; j++) {
                    if (jsonData.sticky[j].id === $("#sticky_id" + i).attr("id")) {
                        jsonDataIndex = j;
                        break;
                    } else {
                        jsonDataIndex++;
                        break;
                    }
                }
                jsonData.sticky[jsonDataIndex] = {
                    "id": "#sticky_id" + i,
                    "text": $("#sticky_id" + i + " .sticky_text").val(),
                    "priority": $("#sticky_id" + i).data("priority"),
                    "status": $("#sticky_id" + i + " .sticky_status").val(),
                    "lastVisited": $("#sticky_id" + i + " .sticky_details").text()
                };
            }
        });
        localStorage.setItem("stickyData", JSON.stringify(jsonData));
        alert("Successfully saved all stickies !!");
    });
});