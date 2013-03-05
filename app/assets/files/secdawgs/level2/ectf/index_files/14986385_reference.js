function getParameter(parameter)
{
    fullQString = window.location.search.substring(1);
    paramArray = fullQString.split("&");
    found = false;
    for (i=0;i<paramArray.length;i++)
    {
      currentParameter = paramArray[i].split("=");
      if(currentParameter[0] == parameter)
         return currentParameter[1];
    }
    return false; //Not found
}


function updateLinks(parameter, value, includeDomainsArray)
{

    var links = document.getElementsByTagName('a');
    var includeDomains = new Array();
    
    if(arguments.length == 3) //has include domains
    {
        //Links will be updated only if they point to one of the following domains:
        //includeDomains = includeDomainsArray.split("|");
        includeDomains = includeDomainsArray;
    }
    else
    {
        //Links will be updated only if they point to one the current domain only:
        includeDomains[0] = self.location.host;
    }
    
    for (var i=0;i<links.length;i++)
    {
        if(links[i].href != "#" && links[i].href != "/" && links[i].href != "" && links[i].href != window.location && (links[i].href.search("#galname")== -1) && (links[i].href.search("javascript")== -1)) //Ignore links with empty src attribute, linking to site root, or anchor tags (#)
        {
            var updateLink = false;
            for(k=0;k<includeDomains.length;k++)
            {
                if(links[i].href.toLowerCase().indexOf(includeDomains[k].toLowerCase()) != -1) //Domain of current link is inlcluded i the includeDomains array.  Update Required...
                    updateLink = true;
            }
        
            if(!updateLink)
            {
                //Do nothing - link not is includeDomains array
            }
            else
            {
                var queryStringComplete = "";
                var paramCount = 0;
            
                var linkParts = links[i].href.split("?");
                
                if(linkParts.length > 1) // Has Query String Params
                {
                    queryStringComplete = "?";
                
                    var fullQString = linkParts[1];
                    var paramArray = fullQString.split("&");    
                    var found = false;
                    
                    for (j=0;j<paramArray.length;j++)
                    {
                        
                        var currentParameter = paramArray[j].split("=");
                        
                        if(paramCount > 0)
                            queryStringComplete = queryStringComplete + "&";
                        
                        if(currentParameter[0] == parameter) //Parameter exists in url, refresh value
                         {
                             queryStringComplete = queryStringComplete + parameter + "=" + value;
                             found = true;
                         }
                         else
                         {
                             queryStringComplete = queryStringComplete + paramArray[j]; //Not related parameter - re-include in url
                         }
                        
                         paramCount++;
                    }
                    
                    if(!found) //Add new param to end of query string
                        queryStringComplete = queryStringComplete + "&" + parameter + "=" + value;
                }
                else
                {
                    queryStringComplete = "?" + parameter + "=" + value;
                }
                    
                links[i].href = links[i].href.split("?")[0] + queryStringComplete;        
            }
        }
        else
        {
            //Do nothing - link not is includeDomains array
        }
    }
}


function addrefParam(){

var domainArray=new Array("sify.com","scores.sify.com","samachar.com"); //Links will be updated only if they point to one of the domain listed here 
var val = getParameter("ref");
if(val != false)
{
updateLinks("ref",val,domainArray); 
}

}