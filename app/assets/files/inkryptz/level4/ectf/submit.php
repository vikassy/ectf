<?php
//this works ' or 0=0 --

$username = $_POST["username"];
$password = $_POST["password"];

$conn = mysql_connect("localhost","root","root");
mysql_select_db("main",$conn);
echo "SELECT * FROM users WHERE username='".$username."' AND password = '".$password."' ";
$result = mysql_query("SELECT * FROM users WHERE username='".$username."' AND password = '".$password."' ");
$row = mysql_fetch_assoc($result);

if($row['username'])
{
	echo "KEY = nnxgxnbwyflumwanylvhemppdcnzgovltdhqcxpaxzqgqnbaru";	
}
  

d
?>
