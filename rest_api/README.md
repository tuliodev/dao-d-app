# DAO REST API

create proposal command:  
 ```
 PS: Deadline you send an number and will be in minutes, example: 30 = 30 minutes, 60 = 1 hour
 node scripts/createProposal.js createProposal title description minimumVotes deadLine
 node scripts/createProposal.js createProposal "Help Brazilians Hospitals" "Help on infraesctrucutre, marketing ,etc....." 1  5
 ```


 run execute proposal cron:

 ```
 yarn cron
 
 or
 
 npm run cron
 
 ```