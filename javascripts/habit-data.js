var habit_data_raw = [
[0.1,1,0,1,0],
[1,0,1,0,1],
[0,1,0,1,0],
[1,0,1,0,1],
[0,1,0,1,0.9]
];

habit_data=[];
habit_data_raw.forEach(function(stack,angle){
  stack.forEach(function(value,radius){
    var d={
      angle:angle,
      radius:radius,
      value:value
    };
    habit_data.push(d);
    // console.log(d);
  });
});