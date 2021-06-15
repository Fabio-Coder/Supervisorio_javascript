const supervisorio_database = {};

(function (){
    let machine_id = false;

    function new_machine(machine, production, status) {
        const machine_data = {
            machine: machine,
            production: production,
            status: status,
            createdat: firebase.database.ServerValue.TIMESTAMP,
        };

        if (!machine_id){
            machine_id = firebase.database().ref().child('machines' + machine_name).push().key;
        }
        
        let machine_name = machine.replace(/[^0-9]/, '');    

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
        if (!machine_id) return {success:false, message: 'Invalid machine.'};

        let machine_ref = firebase.database().ref('/machines/' + machine_name);

        machine_ref.remove()
            .then(function(){
                return {success:true, message: 'Machine removed.'}; 
            })
            .catch(function(error){
                return {success:false, message: 'Machine remove failed: ${error.message}'}; 
            });
    }

    function update_machine(machine_name) {
        if (!machine_id) return {success:false, message: 'Invalid machine.'};

        let machine_ref = firebase.database().ref('/machines/' + machine_name);
        
        let updates = {};
        updates['/machine'] = machine;
        updates['/lastUpdate'] = firebase.database.ServerValue.TIMESTAMP;

        machine_ref.update(updates)
            .then(function(){
                return {success:true, message: 'Machine updated.'}; 
            })
            .catch(function(error){
                return {success:false, message: 'Machine update failed: ${error.message}'}; 
            });
    }

    function reset_machine() {
        if (!machine_id) return {success:false, message: 'Invalid machine.'};
    }

    supervisorio_database.new = new_machine;
    supervisorio_database.remove = remove_machine;
    supervisorio_database.update = update_machine;
    supervisorio_database.reset = reset_machine;

})()