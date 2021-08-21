function ready(callbackFunc) {
  if (document.readyState !== 'loading') {
    // Document is already ready, call the callback directly
    callbackFunc();
  } else if (document.addEventListener) {
    // All modern browsers to register DOMContentLoaded
    document.addEventListener('DOMContentLoaded', callbackFunc);
  } else {
    // Old IE browsers
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') {
        callbackFunc();
      }
    });
  }
}

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

const isThisMonth = (someDate) => {
  const today = new Date()

  return someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear()
}

const formatTime = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  let days = Math.floor(hours / 24);
  let weeks = Math.floor(days / 7);

  let month = Math.floor(days / 30);

  let result = seconds + " сек.";
  if (seconds > 60) {
    result = minutes + " мин. " + (seconds-(minutes*60)) + " сек.";
  }
  if (minutes > 60) {
    result = hours + " ч. " + (minutes - (hours * 60)) + " мин.";
  }
  if (days > 1) {
    result = days + " дн. " + (hours - (days*24)) + " ч.";
  }
  if (weeks > 1) {
    result = weeks + " нед. " + (days - (weeks*7)) + " дн.";
  }

  return result;
}

ready(function() {
  var stats = browser.storage.local.get(null);

    stats.then((result) => {
      let records = {stats: {today: 0, month: 0}}
      result["records"].forEach(function (item, index) {
        if (!records[item.author]) {
          records[item.author] = {global: 0, today: 0, month: 0}
        }
      });

      result["records"].forEach(function (item, index) {
        records[item.author].global = records[item.author].global + Number(item.duration);

        if (isToday(item.date)) {
          records.stats.today = records.stats.today + Number(item.duration);
          records[item.author].today = records[item.author].today + Number(item.duration);
        }

        if (isThisMonth(item.date)) {
          records.stats.month = records.stats.month + Number(item.duration);
          records[item.author].month = records[item.author].month + Number(item.duration);
        }
      });

      var author_month = ""
      var max_month = 0

      var author_today = ""
      var max_today = 0

      var author_global = ""
      var max_global = 0

      Object.keys(records).forEach(function (item) {
          if (item != "stats") {
            if (records[item].month > max_month) { max_month = records[item].month; author_month = item;} 
            if (records[item].today > max_today) { max_today = records[item].today; author_today = item;}
            if (records[item].global > max_global) { max_global = records[item].global; author_global = item;}
          } 
      });

      document.getElementById("global-listens").innerHTML = "За все время вы прослушали " + formatTime(result["played"]) + " музыки!";
      document.getElementById("today-listens").innerHTML = "За сегодня вы прослушали " + formatTime(records.stats.today) + " музыки!";
      document.getElementById("month-listens").innerHTML = "За этот месяц вы прослушали " + formatTime(records.stats.month) + " музыки!";

      document.getElementById("global-favorite").innerHTML = "Ваш любимый исполнитель - " + author_global + " ("+formatTime(max_global)+")";
      document.getElementById("today-favorite").innerHTML = "Ваш любимый исполнитель сегодня - " + author_today + " ("+formatTime(max_today)+")";
      document.getElementById("month-favorite").innerHTML = "В этом месяце ваш любимый исполнитель - " + author_month + " ("+formatTime(max_month)+")";
    });
});