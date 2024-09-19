const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const multer = require('multer');
const path = require('path');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/usersdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const upload = multer({ dest: 'uploads/' }); // Adjust the destination folder as needed

app.post('/api/upload', upload.single('picture'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    // Construct the URL to the uploaded file
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`; // Adjust URL for production if needed

    // Respond with the URL
    res.json({ imageUrl });
});
app.use('/uploads', express.static('uploads'));


// Define a User model
const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    accessibleItems: [String]
});
const DepartmentSchema = new mongoose.Schema({
    id: String,
    departmentName: String,
    superior: String,
    employeeQty: String,
});
const DesignationSchema = new mongoose.Schema({
    id: String,
    designationCode: String,
    designationName: String,
});
const LocationSchema = new mongoose.Schema({
    id: String,
    locationCode: String,
    locationName: String,
    deviceQuantity: String,
    employeeQuantity: String,
    resignedQuantity: String,
});
const EmployeeSchema = new mongoose.Schema({
    employeeId: String,
    firstName: String,
    lastName: String,
    email: String,
    contactNo: String,
    picture: String,
    enrollSite: String,
    gender: String,
    joiningDate: String,
    bankName: String,
    overtimeAssigned: String,
    department: String,
    designationName: String,
    basicSalary: String,
    accountNo: String,
    salaryPeriod: String,
    salaryType: String,
    enableAttendance: String,
    enableSchedule: String,
    enableOvertime: String,
});
const LeaveSchema = new mongoose.Schema({
    employeeId: String,
    employeeName: String,
    leaveType: String,
    startDate: String,
    endDate: String,
    reason: String,
    status: String,
    createdAt: String,
});
const ResignSchema = new mongoose.Schema({
    id: String,
    employeeName: String,
    date: String,
    reason: String,
});
const BounesesSchema = new mongoose.Schema({
    id: String,
    bonusName: String,
    bonusDuration: String,
    bonusAmount: String,
    bonusDate: String,
});
const VisitorSchema = new mongoose.Schema({
    id: Number,
    firstName:String,
    lastName:String,
    crftNo:String,
    createTime:String,
    exitTime:String,
    email:String,
    phoneNo:String,
    visitingDepartment:String,
    host:String,
    visitingReason:String,
    carryingGoods:String,
    image:Object
});
const shiftSchema = new mongoose.Schema({
    id: Number,
    name:String,
    lastName:String,
    startTime:String,
    endTime:String,
    exitTime:String,
    entryStartTime:String,
    entryEndTime:String,
    exitStartTime:String,
    exitEndTime:String
});

const User = mongoose.model('User', UserSchema);
const Department = mongoose.model('Department', DepartmentSchema);
const Designation = mongoose.model('Designation', DesignationSchema);
const Location = mongoose.model('Location', LocationSchema);
const Employee = mongoose.model('Employee', EmployeeSchema);
const Resign = mongoose.model('Resign', ResignSchema);
const Leave = mongoose.model('Leave', LeaveSchema);
const Bouneses = mongoose.model('Bouneses', BounesesSchema);
const Visitors = mongoose.model('Visitors', VisitorSchema);
const Shifts = mongoose.model('Shifts', shiftSchema);

//////////////////////////////////////////////////////////////( DEPARTMENT )////////////////////////////////////////////////////////////////////
// API endpoint to add a new user
app.post('/api/addDepartments', async (req, res) => {
    const { id, departmentName, superior, employeeQty } = req.body;
    try {
        const newDepartment = new Department({ id, departmentName, superior, employeeQty });

        const savedDepartment = await newDepartment.save();
        res.status(201).json(savedDepartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.put('/api/updateDepartments', async (req, res) => {
    const { _id, departmentName, superior, employeeQty } = req.body;
    console.log(_id, departmentName, superior, employeeQty)
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(
            _id,
            { departmentName, superior, employeeQty },
            { new: true }
        );
        if (!updatedDepartment) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedDepartment);
    } catch (error) {
        console.error('Error updating department:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating department" });
    }
});

app.post('/api/deleteDepartments', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the id is sent in the request body
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Department.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/fetchDepartment', async (req, res) => {
    try {
        const department = await Department.find();
        console.log(department)
        res.status(200).json(department);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});


//////////////////////////////////////////////////////////////////////( DESIGNATION )//////////////////////////////////////////////////////////////////////////

app.get('/api/fetchDesignation', async (req, res) => {
    try {
        const designation = await Designation.find();
        console.log(designation)
        res.status(200).json(designation);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});
app.post('/api/addDesignation', async (req, res) => {
    const { designationCode, designationName } = req.body;
    try {
        const newDesignation = new Designation({ designationCode, designationName });
        console.log({ designationCode, designationName })
        const savedDesignation = await newDesignation.save();
        res.status(201).json(savedDesignation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
app.post('/api/updateDesignation', async (req, res) => {
    const { _id, designationCode, designationName } = req.body;
    console.log(_id, designationCode, designationName)
    try {
        const updatedDesignation = await Designation.findByIdAndUpdate(
            _id,
            { designationCode, designationName },
            { new: true }
        );
        if (!updatedDesignation) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedDesignation);
    } catch (error) {
        console.error('Error updating department:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating department" });
    }
});

app.post('/api/deleteDesignation', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the id is sent in the request body
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Designation.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
/////////////////////////////////////////////////////////////////( LOCATION )//////////////////////////////////////////////////////////////////////////////////////
app.get('/api/fetchLocation', async (req, res) => {
    try {
        const location = await Location.find();
        console.log(location)
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});

app.post('/api/addLocation', async (req, res) => {
    const { locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity } = req.body;
    try {
        const newLocation = new Location({ locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity });
        console.log({ locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity })
        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
app.post('/api/updateLocation', async (req, res) => {
    const { _id, locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity } = req.body;
    console.log(_id, locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity)
    try {
        const updateLocation = await Location.findByIdAndUpdate(
            _id,
            { locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity },
            { new: true }
        );
        if (!updateLocation) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json(updateLocation);
    } catch (error) {
        console.error('Error updating department:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating department" });
    }
});

app.post('/api/deleteLocation', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the id is sent in the request body
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Location.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
/////////////////////////////////////////////////////////////////( USERS )//////////////////////////////////////////////////////////////////////////////////////
app.post('/api/deleteUsers', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the ID is sent in the request body

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
app.post('/api/users', async (req, res) => {
    const { id, name, email, password, accessibleItems } = req.body;
    try {
        const newUser = new User({ id, name, email, password, accessibleItems });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// API endpoint to fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        console.log(users)
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});

app.post('/api/upDateUsers', async (req, res) => {
    const { _id, name, password, email, accessibleItems } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { name, password, email, accessibleItems },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


/////////////////////////////////////////////////////////////////( EMPLOYEE )//////////////////////////////////////////////////////////////////////////////////////

app.post('/api/addEmployee', async (req, res) => {
    const { employeeId,
        firstName,
        lastName,
        email,
        contactNo,
        picture,
        enrollSite,
        gender,
        joiningDate,
        bankName,
        overtimeAssigned,
        department,
        designationName,
        basicSalary,
        accountNo,
        salaryPeriod,
        salaryType,
        enableAttendance,
        enableSchedule,
        enableOvertime } = req.body;
    try {
        const newEmployee = new Employee({
            employeeId,
            firstName,
            lastName,
            email,
            contactNo,
            picture,
            enrollSite,
            gender,
            joiningDate,
            bankName,
            overtimeAssigned,
            department,
            designationName,
            basicSalary,
            accountNo,
            salaryPeriod,
            salaryType,
            enableAttendance,
            enableSchedule,
            enableOvertime,
        });
        console.log({
            employeeId,
            firstName,
            lastName,
            email,
            contactNo,
            picture,
            enrollSite,
            gender,
            joiningDate,
            bankName,
            overtimeAssigned,
            department,
            designationName,
            basicSalary,
            accountNo,
            salaryPeriod,
            salaryType,
            enableAttendance,
            enableSchedule,
            enableOvertime,
        })
        const saveEmployee = await newEmployee.save();
        res.status(201).json(saveEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

/////////////////////////////////////////////////////////////////( RESIGN )//////////////////////////////////////////////////////////////////////////////////////

app.get('/api/fetchResign', async (req, res) => {
    try {
        const resign = await Resign.find();
        console.log(resign)
        res.status(200).json(resign);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching resigns' });
    }
});

app.post('/api/addResign', async (req, res) => {
    const { employeeName, date, reason } = req.body;
    try {
        const newResign = new Resign({ employeeName, date, reason });
        console.log({ employeeName, date, reason })
        const savedResign = await newResign.save();
        res.status(201).json(Resign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/updateResign', async (req, res) => {
    const { _id, employeeName, date, reason } = req.body;
    console.log(_id, employeeName, date, reason)
    try {
        const updatedResign = await Resign.findByIdAndUpdate(
            _id,
            { employeeName, date, reason },
            { new: true }
        );
        if (!updatedResign) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedResign);
    } catch (error) {
        console.error('Error updating resign:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating resign" });
    }
});

app.post('/api/deleteResign', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the id is sent in the request body
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Resign.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

///////////////////////////////////////////////////////////////////( LOCATION ) ///////////////////////////////////////////////////////////////////////////////////
app.post('/api/updateLocation', async (req, res) => {
    const { _id, locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity } = req.body;
    console.log(_id, locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity)
    try {
        const updateLocation = await Location.findByIdAndUpdate(
            _id,
            { locationCode, locationName, deviceQuantity, employeeQuantity, resignedQuantity },
            { new: true }
        );
        if (!updateLocation) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json(updateLocation);
    } catch (error) {
        console.error('Error updating department:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating department" });
    }
});

app.post('/api/deleteLocation', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the id is sent in the request body
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Location.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const UserPassword = user.password;
        console.log(UserPassword)
        if (UserPassword == password) {
            console.log('Login');

            res.send(user.accessibleItems)
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/fetchLocation', async (req, res) => {
    try {
        const location = await Location.find();
        console.log(location)
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});


///////////////////////////////////////////////////////////////////( LEAVE ) ///////////////////////////////////////////////////////////////////////////////////
app.post('/api/updateLeave', async (req, res) => {
    const { _id, employeeId, employeeName, leaveType, startDate, endDate, reason, status, createdAt } = req.body;
    console.log(_id, employeeId, employeeName, leaveType, startDate, endDate, reason, status, createdAt)
    try {
        const updateLeave = await Leave.findByIdAndUpdate(
            _id,
            { employeeId, employeeName, leaveType, startDate, endDate, reason, status, createdAt },
            { new: true }
        );
        if (!updateLeave) {
            return res.status(404).json({ message: "Leave not found" });
        }
        res.status(200).json(updateLeave);
    } catch (error) {
        console.error('Error updating leave:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating leave" });
    }
});

app.post('/api/deleteLeave', async (req, res) => {
    try {
        const { id } = req.body; // Assuming the id is sent in the request body
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Leave.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Leave not found" });
        }

        res.status(200).json({ message: "Leave deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/addLeave', async (req, res) => {
    const { employeeId, employeeName, leaveType, startDate, endDate, reason, status, createdAt } = req.body;
    try {
        const newLeave = new Leave({ employeeId, employeeName, leaveType, startDate, endDate, reason, status, createdAt });
        console.log({ employeeId, employeeName, leaveType, startDate, endDate, reason, status, createdAt })
        const savedLeave = await newLeave.save();
        res.status(201).json(Leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/fetchLeave', async (req, res) => {
    try {
        const leaves = await Leave.find();
        console.log(leaves)
        res.status(200).json(leaves);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});

///////////////////////////////////////////////////////////////////( BOUNSES ) ///////////////////////////////////////////////////////////////////////////////////
app.post('/api/updateBouneses', async (req, res) => {
    const { _id, id, bonusName, bonusDuration, bonusAmount, bonusDate } = req.body;
    console.log(_id, id, bonusName, bonusDuration, bonusAmount, bonusDate)
    try {
        const updateBouneses = await Bouneses.findByIdAndUpdate(
            _id,
            { id, bonusName, bonusDuration, bonusAmount, bonusDate },
            { new: true }
        );
        if (!updateBouneses) {
            return res.status(404).json({ message: "Leave not found" });
        }
        res.status(200).json(updateBouneses);
    } catch (error) {
        console.error('Error updating leave:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating leave" });
    }
});

app.post('/api/deleteBouneses', async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Bouneses.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Bouneses not found" });
        }

        res.status(200).json({ message: "Bouneses deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/addBouneses', async (req, res) => {
    const { id, bonusName, bonusDuration, bonusAmount, bonusDate } = req.body;
    try {
        const newBouneses = new Bouneses({ id, bonusName, bonusDuration, bonusAmount, bonusDate });
        console.log({ id, bonusName, bonusDuration, bonusAmount, bonusDate })
        const savedBouneses = await newBouneses.save();
        res.status(201).json(Bouneses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/fetchBouneses', async (req, res) => {
    try {
        const bounesesData = await Bouneses.find();
        res.status(200).json(bounesesData);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});

///////////////////////////////////////////////////////////////////( VISITOR ) ///////////////////////////////////////////////////////////////////////////////////
app.post('/api/updateVisitor', async (req, res) => {
    const { _id, id, bonusName, bonusDuration, bonusAmount, bonusDate } = req.body;
    console.log(_id, id, bonusName, bonusDuration, bonusAmount, bonusDate)
    try {
        const updateBouneses = await Bouneses.findByIdAndUpdate(
            _id,
            { id, bonusName, bonusDuration, bonusAmount, bonusDate },
            { new: true }
        );
        if (!updateBouneses) {
            return res.status(404).json({ message: "Leave not found" });
        }
        res.status(200).json(updateBouneses);
    } catch (error) {
        console.error('Error updating leave:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating leave" });
    }
});

app.post('/api/deleteVisitor', async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Bouneses.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Bouneses not found" });
        }

        res.status(200).json({ message: "Bouneses deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/addVisitor', async (req, res) => {
    const { id, firstName, lastName, crftNo, createTime, exitTime, email, phoneNo, visitingDepartment, host, visitingReason, carryingGoods, image } = req.body;
    try {
        const newVisitor = new Visitors({ id, firstName, lastName, crftNo, createTime, exitTime, email, phoneNo, visitingDepartment, host, visitingReason, carryingGoods, image });
        console.log({ id, firstName, lastName, crftNo, createTime, exitTime, email, phoneNo, visitingDepartment, host, visitingReason, carryingGoods, image })
        const savedVisitor = await newVisitor.save();
        res.status(201).json(savedVisitor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/fetchVisitor', async (req, res) => {
    try {
        const visitorData = await Visitors.find();
        res.status(200).json(visitorData);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});
///////////////////////////////////////////////////////////////( SHIFT_MANAGMENT ) //////////////////////////////////////////////////////////////////
app.post('/api/updateShift', async (req, res) => {
    const { _id, id, name, startTime, endTime, entryStartTime, entryEndTime, exitStartTime, exitEndTime } = req.body;
    console.log(_id, id, name, startTime, endTime, entryStartTime, entryEndTime, exitStartTime, exitEndTime)
    try {
        const updateShifts = await Shifts.findByIdAndUpdate(
            _id,
            { id, name, startTime, endTime, entryStartTime, entryEndTime, exitStartTime, exitEndTime },
            { new: true }
        );
        if (!updateShifts) {
            return res.status(404).json({ message: "Leave not found" });
        }
        res.status(200).json(updateShifts);
    } catch (error) {
        console.error('Error updating leave:', error.message); // More specific logging
        res.status(500).json({ message: "Error updating leave" });
    }
});

app.post('/api/deleteShift', async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const result = await Shifts.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Shifts not found" });
        }

        res.status(200).json({ message: "Shifts deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/addShift', async (req, res) => {
    const { id, name, startTime, endTime, exitTime, entryStartTime, entryEndTime, exitStartTime, exitEndTime} = req.body;
    try {
        const newShifts = new Shifts({ id, name, startTime, endTime, exitTime, entryStartTime, entryEndTime, exitStartTime, exitEndTime});
        console.log({ id, name, startTime, endTime, exitTime, entryStartTime, entryEndTime, exitStartTime, exitEndTime})
        const savedShifts = await newShifts.save();
        res.status(201).json(savedShifts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/fetchShift', async (req, res) => {
    try {
        const shiftsData = await Shifts.find();
        res.status(200).json(shiftsData);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching users' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
