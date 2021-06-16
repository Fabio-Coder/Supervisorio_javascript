const supervisorio_database = {};

(function (){
    let machine_id = false;
    let machine_name = '';

    function new_machine(machine, production, status) {
        const machine_data = {
            machine: machine,
            production: production,
            status: status,
            createDate: firebase.database.ServerValue.TIMESTAMP,
        };

        let machine_name = machine.replace(/[^0-9]/, '');  

        if (!machine_id){
            machine_id = firebase.database().ref().child('machines' + machine_name).push().key;
        }
            
        let updates = {};
        updates['/machines/' + machine_name] = machine_data;

        let machine_ref = firebase.database().ref();

        machine_ref.update(updates)
            .then(function(){
                return {success:true, message: 'Machine created.'}; 
            })
            .catch(function(error){
                return {success:false, message: 'Machine creation failed: ${error.message}'}; 
            });
    }

    function remove_machine(machine_name) {
        if (!machine_name) return {success:false, message: 'Invalid machine.'};

        let machine_ref = firebase.database().ref('/machines/' + machine_name);

        machine_ref.remove()
            .then(function(){
                return {success:true, message: 'Machine removed.'}; 
            })
            .catch(function(error){
                return {success:false, message: 'Machine remove failed: ${error.message}'}; 
            });
    }

    function update_machine(machine_name, production, status) {
        if (!machine_id) return {success:false, message: 'Invalid machine.'};

        let machine_ref = firebase.database().ref('/machines/' + machine_name);
        
        let updates = {};
        updates['/production'] = production,
        updates['/status'] = status,
        updates['/lastUpdate'] = firebase.database.ServerValue.TIMESTAMP,
        
        machine_ref.update(updates)
            .then(function(){
                return {success:true, message: 'Machine updated.'}; 
            })
            .catch(function(error){
                return {success:false, message: 'Machine update failed: ${error.message}'}; 
            });
    }

    function reset_machine() {
        if (!machine_name) return {success:false, message: 'Invalid machine.'};   
    }

    //var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
    //starCountRef.on('value', (snapshot) => {
    //const data = snapshot.val();
    //updateStarCount(postElement, data);
    //});


    async function listen_machines(){
        if (!machine_id) return {success:false, message: 'Invalid machine.'};
        
        let machine_ref = firebase.database().ref('/machines/' + machine_name);

        machine_ref.on('value',(snapshot) => {
            const data = snapshot.val();
            console.log('Production changed: ', snapshot.val());
        });
            // .then(function(snapshot) {
            //     //Production
            //     console.log('Production changed: ', snapshot.val());
            //     if(snapshot.key == 'production') {
            //         console.log('Production changed: ', snapshot.val());
            //         return {success: true, message: 'Production updated.', data: snapshot.val()};
            //     //Status
            //     } else if(snapshot.key == 'status'){
            //         console.log('Status changed: ', snapshot.val());
            //         return {success: true, message: 'Status updated.', data: snapshot.val()};
            //     }

            // })
            // .catch(function(error){
            //     return {success:false, message: 'Machine update failed: ${error.message}'}; 
            // });
    }




    supervisorio_database.new = new_machine;
    supervisorio_database.remove = remove_machine;
    supervisorio_database.update = update_machine;
    supervisorio_database.reset = reset_machine;
    supervisorio_database.listen = listen_machines;

})()

