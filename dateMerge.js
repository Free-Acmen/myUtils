  /**
     * 日期合并分段
     */

// 数组a
    var a = [];
//    a[0] = ['2017-01-01', '2018-12-31'];
//    a[1] = ['2020-01-01', '2020-05-31'];
    a[0] = ['2017-01-01', '2017-12-01'];
    a[1] = ['2018-03-01', '2018-05-31'];
    a[2] = ['2018-06-08', '2018-06-20'];
    a[3] = ['2018-07-01', '2018-08-01'];
    a[4] = ['2018-08-05', '2018-09-20'];
    a[5] = ['2018-10-10', '2018-10-10'];
    a[6] = ['2018-11-01', '2018-11-30'];
    a[7] = ['2019-01-01', '2019-04-01'];
    a[8] = ['2019-08-20', '2019-12-20'];
    a[9] = ['2019-12-25', '2020-05-30'];

    // 数组b
    var b = [];
//    b[0] = ['2017-12-01', '2017-12-01'];
//    b[1] = ['2018-10-01', '2018-10-01'];
//    b[2] = ['2018-12-31', '2019-01-01'];
    b[0] = ['2016-12-01', '2017-09-25'];
    b[1] = ['2017-10-01', '2017-11-30'];
    b[2] = ['2018-01-05', '2018-02-15'];
    b[3] = ['2018-03-10', '2018-03-10'];
    b[4] = ['2018-03-11', '2018-03-11'];
    b[5] = ['2018-04-03', '2018-04-13'];
    b[6] = ['2018-05-04', '2019-05-10'];
    b[7] = ['2019-06-10', '2019-07-10'];
    b[8] = ['2019-12-01', '2019-12-31'];
    b[9] = ['2020-12-27', '2021-01-30'];

    // 数组c
    var c = [];
    /*['2017-12-01', '2017-12-30', '2018-01-05', '2018-02-28', '2018-12-31', '2019-06-01', '2019-08-31', '2019-12-31']
    ['2017-12-01', '2017-12-30', ['2017-12-31', '2018-01-04'], '2018-01-05', '2018-02-28', '2018-03-01', '2018-12-31',  '2019-06-01', '2019-08-31', '2019-09-01', '2019-12-31']
    ['2017-12-01', '2017-12-30', ['2017-12-31', '2018-01-04'], '2018-01-05', '2018-02-28',['2018-03-01'], '2018-12-31']
    ['2017-12-01', '2017-12-30', '2017-12-31', '2018-01-04', '2018-01-05', '2018-02-28', '2018-03-01', '2018-12-31']*/

    /**
     * 写代码，使c等于d。c的数据通过a和b计算得到
     */
    var date1 = new Date();
    var c = dateMerge(a, b);
    console.log(new Date() - date1);
    console.log(c);

    function dateMerge(datea, datec){
        var newDatea = datea, newDatec = datec, newDate = [], oneDay = [];

        //1.判断 datea datec符合预期的规则,否则报错
        if(!checkDate(datea, oneDay) || !checkDate(datec, oneDay)){
            throw new Error('传入的数据不符合预订规则');
        }
        //2.舍弃掉datec中不包括在datea中的时间段
        newDatec = filterDate(newDatea, newDatec);

        //3.通过dateb的时间段,将datea拆分为时间片段
        var allDate = ([].concat.apply([], newDatea)).concat([].concat.apply([], newDatec));
        allDate.forEach(function(val, index, arr){
            arr[index] = new Date(val).getTime();
        });

        //数组去重 es6,逻辑走通后再写兼容的数组去重
        allDate = Array.from(new Set(allDate));
//        console.log(oneDay);
        //数组排序
        allDate = allDate.concat(oneDay);
        allDate.sort();
        newDate = integrateDate(allDate, datea, datec);
        return newDate;
    }

    function checkDate(date, oneDay){
        var flag = true;
        for(var i=0; i<date.length; i++){
            var starta = new Date(date[i][0]).getTime();
            var enda = new Date(date[i][1]).getTime();
            if(starta > enda){
                flag = false;
                break;
            }else if(starta == enda){
                if(oneDay.indexOf(starta) == -1){
                    oneDay.push(starta);
                }
            }
            for(var j=i+1; j<date.length; j++){
                var startc = new Date(date[j][0]).getTime();
                var endc = new Date(date[j][1]).getTime();
                if(startc > endc){
                    flag = false;
                    break;
                }else if(startc == endc){
                    if(oneDay.indexOf(startc) == -1){
                        oneDay.push(startc);
                    }
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
                j--;
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
                }else{//理论上到不了该逻辑内
                    time = changeDay(date[i+1], 'reduce');
                    if(isDateArr(time, datea)){
                        arr.push(formattDate(time));
                    }else{
                        arr.push(formattDate(date[i]));
                    }
                    i--;
                }
            }else if(isDateArr(date[i], datea)){
                arr.push(formattDate(date[i]));
                if(isDateArr(date[i+1], datec)){
                    time = changeDay(date[i+1], 'reduce');
                    if(isDateArr(time, datea)){
                        arr.push(formattDate(time));
                    }else{
                        arr.push(formattDate(date[i]));
                    }
                    i--;
                }else{
                    time = changeDay(date[i+1], 'reduce');
                    if(date[i+1] == date[i] || isDateArr(time, datea)){
                        arr.push(formattDate(date[i+1]));
                        time = changeDay(date[i+1], 'add');
                        if(time != date[i+2] && isDateArr(time, datea)){
                            date.splice(i+2, 0, time);
                        }
                    }else{
                        arr.push(formattDate(date[i]));
                        i--
                    }
                }
            }
            if(arr.length > 0){
                newDate.push(arr);
            }
        }

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