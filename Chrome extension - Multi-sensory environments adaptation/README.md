"Multi-sensory environments adaptation for the relaxation of children with neurodevelopmental disorders" 
Master thesis by Michael Lovisa, Politecnico di Milano

# Lights settings 
- Step 1: plugin the DC power adapter into the back of the hue bridge and then into an available power outlet
- Step 2: connect the provided Ethernet cable into an available Ethernet port on your router and connect the other end into the port on the hue bridge
- Step 3: turn on the bridge and wait for all lights on the Hue Bridge to become a solid blue color, this could take up to 5 minutes
- Step 4: discover the IP address of the bridge on your network, this can be done in two ways:
		1 - log into your wireless router and look Philips hue up in the DHCP table
		2 - download the official Philips hue app, connect your phone to the network the hue bridge is on. Start the hue app. 
		     Push link connect to the bridge. Use the app to find the bridge and try controlling lights. All working -- Go to the settings menu in the app. 
		     Go to My Bridge. Go to Network settings. Switch off the DHCP toggle. The ip address of the bridge will show. Note the ip address, then switch DHCP back on
- Step 5: open your browser and visit http://<bridge ip address>/debug/clip.html
- Step 6: fill in the details below leaving the body box empty and press the GET button.
	
	Address	http://<bridge ip address>/api
	Body	{"devicetype":"Multi-sensory environment adaptation"}
	Method	POST

              When you press the POST button you should get back an error message letting you know that you have to press the link button on the bridge.
              Go and press the button on the bridge and then press the POST button again and you should get a success response indicating a username.
- Step 7: copy that username and paste it into the file JSON_Lights.json in the right place, or write a new file indicating the username like in the example below
              
              Example of JSON_Lights.json file 
              {"username": "rgKJOoZlcLjtWWwGFT-4NJamqdjEM777gaAyArjI"}

              This will be the JSON file to upload as JSON Lights Settings File in the software.


# Start Chrome application
- In Chrome from chrome://extensions, enable developer function -> Load Unpacked extension -> select project folder -> Active (To see console right click on the opened window -> inspect)

If some modifications have been made to one of the files containing the code of the project, the following command is needed to build the global code
From project folder in command line do "browserify -r cylon-mindflex UI.js -o bundle2.js"

# Usage scenarios of the software & presets buttons 1,2,3
The three presets buttons in the adaptation module represents the three possible scenarios and goals of the session

	Scenario 1 (preset 1)
	- Goals: relax the child and improve his everyday relaxation abilities
	- Music adaptability settings: global volume adaptation with inverse effect

	Scenario 2 (preset 2)
	- Goals: relax the child and enhance the relaxation power of the music to guide him into a deeper relaxation manipulating it by slowing down the tempo and/or filtering out the high frequencies
	- Music adaptability settings: tempo adaptation with inverse effect and/or filter adaptation with inverse effect

	Scenario 3 (preset 3)
	- Goals: relax the child and improve his ability to handle multiple stimuli or noises
	- Music adaptability settings: volume adaptation of a single instrument with direct effect and/or filter adaptation of a single instrument with direct effect


IMPORTANT: if the audio is glitchy, try to change the scheduling lookahead time. This parameter can be found at row 104 in the file musicmaker.js; then use browserify as presented earlier.

