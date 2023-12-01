# bachelor-thesis
My bachelor thesis


# Here you can see my weekly progress, board with current issues and other information:  
https://www.notion.so/Thesis-Planning-b8e8178f1d0847cab43a30bbf7083ef8?pvs=4  (Notion workspace)   
https://likeable-pike-776.notion.site/Thesis-Planning-b8e8178f1d0847cab43a30bbf7083ef8?pvs=4 (Notion page as a static website)  

## Installation Instructions
**Database configuration**
*Install docker
*Install lastest postgres image
*in console run
```shell
docker run -d --name rvtool -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
```  
This way you will create a database with one superuser postgres and password postgres and run it on localhost::5432  