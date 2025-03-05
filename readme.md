### Direct mentionds

## Step 1
- When user enters @ just show a modal with api "search_users" to get the list of users, by default it should say type a name to mention with empty page
- when user taps a name to mention, it should show the name in the text field with @ in front of it, but for backend, it should be like this:

# show to user on chat
```
hello @user1
```

# send to server actually
```
hello <@user1[9]>
```

## Step 2
when you get msg back from db, it would like exactly how you sent it, now how would you decode it?

```
$actualMsg = '';
$rawParts = response_from_db.split('<@');
if($rawParts.length>0){
    $actualMsg = $rawParts[0];
    for($i=1;$i<$rawParts.length;$i++){
        $actualMsg += '@'+$rawParts[$i].split('[')[0];
        $actualMsg += $rawParts[$i].split(']>')[1];
    }
}

```
react code to generate <Text> from above example
```
<Text>
    {actualMsg.split('<@').map((part, index) => {
        if(index==0){
            return part;
        }
        return 
            <Text>
                <Text style={{color: 'blue'}}>@{part.split('[')[0]}</Text>;
                {part.split(']>')[1]}
            </Text>
    })}
</Text>