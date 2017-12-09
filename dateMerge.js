  /**
     * 日期合并分段
     */

// 数组a
    var a = [];
    a[0] = ['2017-12-01', '2018-12-31'];
    a[1] = ['2019-04-01', '2019-08-31'];

    // 数组b
    var b = [];
    b[0] = ['2017-12-01', '2017-12-30'];
    b[1] = ['2018-01-05', '2018-02-28'];
    b[2] = ['2019-03-01', '2019-09-31'];
    // 数组c
    var c = [];
    /*['2017-12-01', '2017-12-30', '2018-01-05', '2018-02-28', '2018-12-31', '2019-06-01', '2019-08-31', '2019-12-31']
    ['2017-12-01', '2017-12-30', ['2017-12-31', '2018-01-04'], '2018-01-05', '2018-02-28', '2018-03-01', '2018-12-31',  '2019-06-01', '2019-08-31', '2019-09-01', '2019-12-31']
    ['2017-12-01', '2017-12-30', ['2017-12-31', '2018-01-04'], '2018-01-05', '2018-02-28',['2018-03-01'], '2018-12-31']
    ['2017-12-01', '2017-12-30', '2017-12-31', '2018-01-04', '2018-01-05', '2018-02-28', '2018-03-01', '2018-12-31']*/

    /**
     * 写代码，使c等于d。c的数据通过a和b计算得到
     */

    var c = dateMerge(a, b);
    function dateMerge(datea, datec){
        var newDatea = datea, newDatec = datec, newDate = [];

        //1.判断 datea datec符合预期的规则,否则报错
        if(!checkDate(datea) || !checkDate(datec)){
            throw new Error('传入的数据不符合预订规则');
        }
        //2.舍弃掉datec中不包括在datea中的时间段
        newDatec = filterDate(newDatea, newDatec);

        //3.通过datec的时间段,将datea拆分为时间片段
        var allDate = ([].concat.apply([], newDatea)).concat([].concat.apply([], newDatec));
        allDate.forEach(function(val, index, arr){
            arr[index] = new Date(val).getTime();
        });
        //数组去重 es6,逻辑走通后再写兼容的数组去重
        allDate = Array.from(new Set(allDate));
        //数组排序
        allDate.sort();

        newDate = integrateDate(allDate, datea, datec);
        return newDate;
    }

    function checkDate(date){
        var flag = true;
        for(var i=0; i<date.length-1; i++){
            var starta = new Date(date[i][0]).getTime();
            var enda = new Date(date[i][1]).getTime();
            if(starta >= enda){
                flag = false;
                break;
            }
            for(var j=i+1; j<date.length; j++){
                var startc = new Date(date[j][0]).getTime();
                var endc = new Date(date[j][1]).getTime();
                if(startc >= endc){
                    flag = false;
                    break;
                }
                if(startc>=starta && startc<=enda || endc>=starta && endc<=enda){
                    flag = false;
                    break;
                }
            }
        }
        return flag;
    }

    function filterDate(datea, datec){
        for(var j=0; j<datec.length; j++){
            var startc = new Date(datec[j][0]).getTime();
            var endc = new Date(datec[j][1]).getTime();
            if(!isDateArr(startc, datea) && !isDateArr(endc, datea)){
                datec.splice(j, 1);
            }else if(!isDateArr(startc, datea) || !isDateArr(endc, datea)){
                for(var i=0; i<datea.length; i++) {
                    var starta = new Date(datea[i][0]).getTime();
                    var enda = new Date(datea[i][1]).getTime();
                    if(startc>=starta && startc<=enda){
                        datec[j][1] = datea[i][1];
                    }else if(endc>=starta && endc<=enda){
                        datec[j][0] = datea[i][0];
                    }
                }
            }
        }
        return datec;
    }

    function integrateDate(date, datea, datec){
        var newDate = [], time;
        for(var i=0; i<date.length; i+=2){
            var arr = [];
            if(isDateArr(date[i], datec)){
                arr.push(formattDate(date[i]));
                if(isDateArr(date[i+1], datec)){
                    arr.push(formattDate(date[i+1]));
                    time = changeDay(date[i+1], 'add');
                    if(time != date[i+2] && isDateArr(time, datea)){
                        date.splice(i+2, 0, time);
                    }
                }else{
                    time = changeDay(date[i+1], 'reduce');
                    arr.push(formattDate(time));
                    i--;
                }
            }else if(isDateArr(date[i], datea)){
                arr.push(formattDate(date[i]));
                if(isDateArr(date[i+1], datec)){
                    time = changeDay(date[i+1], 'reduce');
                    arr.push(formattDate(time));
                    i--;
                }else{
                    arr.push(formattDate(date[i+1]));
                    time = changeDay(date[i+1], 'add');
                    if(time != date[i+2] && isDateArr(time, datea)){
                        date.splice(i+2, 0, time);
                    }
                }
            }
            if(arr.length > 0){
                newDate.push(arr);
            }
        }

        /*date.forEach(function(val, index, arr){
            arr[index] = formattDate(val);
        });*/
        return newDate;
    }

    function formattDate(time){
        var date = new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        m = m >= 10 ? m : "0"+ m;
        d = d >= 10 ? d : "0"+ d;
        var ymd = y+ '-' + m + '-' + d;
        return ymd;
    }

    function isDateArr(time, arr){
        var state = false;
        for(var i=0; i<arr.length; i++){
            if(time >new Date(arr[i][0]).getTime() && time < new Date(arr[i][1]).getTime()){
                state = true;
                break;
            }else if(time == new Date(arr[i][0]).getTime() || time == new Date(arr[i][1]).getTime()){
                state = "border";
                break;
            }
        }
        return state;
    }

    function changeDay(time, state){
        var date = new Date(time);
        if(state == 'add'){
            date.setDate(date.getDate() + 1);
        }else if(state == 'reduce'){
            date.setDate(date.getDate() - 1);
        }
        return date.getTime();
    }

    var d = [];
    d[0] = ['2017-12-01', '2017-12-30'];
    d[1] = ['2017-12-31', '2018-01-04'];
    d[2] = ['2018-01-05', '2018-02-28'];
    d[3] = ['2018-03-01', '2018-12-31'];

    console.log(c);
    console.log(d);
