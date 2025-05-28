// Initialize Supabase
const supabaseUrl = 'https://ymxfetchbupbrwsdseba.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteGZldGNoYnVwYnJ3c2RzZWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDUxNjksImV4cCI6MjA2Mjk4MTE2OX0.zQGIwen5m-pw6Mi4FT8GrSWsNQK6ze83tSSYOgAy1hA';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Register new user
async function signUp() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert('Error signing up: ' + error.message);
  else alert('Registered successfully! Please check your email to confirm your account.');
}

// Log in user
async function signIn() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert('Login failed: ' + error.message);
  else {
    alert('Logged in successfully!');
    window.location.href = 'dashboard.html';
  }
}

// Log out user
async function signOut() {
  await supabase.auth.signOut();
  alert('Logged out.');
  window.location.href = 'index.html';
}

// Submit incident form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('incidentForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const impact = document.getElementById('impact').value;

      const { error } = await supabase.from('incidents').insert([
        {
          title,
          description,
          impact_level: impact,
          status: 'Reported',
          created_at: new Date()
        }
      ]);

      if (error) {
        alert('Error reporting incident.');
        console.error('Insert error:', error);
      } else {
        alert('Incident reported successfully!');
        sessionStorage.setItem('impactLevel', impact); // For BIA display
        window.location.href = 'admin.html'; // Redirect to admin panel after report
      }
    });
  }

  // If on admin.html, load incident data and BIA
  const list = document.getElementById('incidentList');
  const admin = document.getElementById('adminPanel');
  const bia = document.getElementById('biaReport');

  if (list && admin && bia) {
    loadIncidents();

    const savedImpact = sessionStorage.getItem('impactLevel');
    if (savedImpact) {
      generateBIARecommendation(savedImpact);
      sessionStorage.removeItem('impactLevel');
    }
  }
});

// Load incidents and admin controls
async function loadIncidents() {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('incidentList');
  const admin = document.getElementById('adminPanel');
  list.innerHTML = '';
  admin.innerHTML = '';

  if (error) return console.error('Error loading incidents:', error);

  data.forEach(item => {
    // Reported Incidents Section (with Delete button)
    const div = document.createElement('div');

    const createdAt = new Date(item.created_at);
    const date = createdAt.toLocaleDateString();
    const time = createdAt.toLocaleTimeString();
    div.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; background: #fff4f4; border: 1px solid #cc0000; border-radius: 5px; text-align: left;">
      <thead>
        <tr style="background-color: #ffd6d6;">
          <th style="padding: 8px; border: 1px solid #cc0000;">Incident Title</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Impact Level</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Location</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Description</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Status</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Date</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Time</th>
          <th style="padding: 8px; border: 1px solid #cc0000;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.title}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.impact_level}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.location}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.description}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.status}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${date}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${time}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">
            <button onclick="deleteIncident(${item.id})" style="color: red; margin-right: 5px;">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  
  
  
  
    // Append to the page
    document.getElementById('incidentList').appendChild(div);
    
    // Cancel function (you can define the behavior)
    function cancelAction() {
      alert("Action cancelled.");
    }
    
    
    document.getElementById('incidentList').appendChild(div);
    
    
    document.getElementById('incidentList').appendChild(div);
    
    
    
    list.appendChild(div);

    // Admin Panel (status dropdown)
    const adminDiv = document.createElement('div');
    adminDiv.innerHTML = `
      <strong>${item.title}</strong><br/>
      <select id="status-${item.id}">
        <option value="Reported" ${item.status === 'Reported' ? 'selected' : ''}>Reported</option>
        <option value="Investigating" ${item.status === 'Investigating' ? 'selected' : ''}>Investigating</option>
        <option value="Resolved" ${item.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
      </select>
      <button onclick="updateStatus(${item.id})">Update Status</button><hr/>
    `;
    admin.appendChild(adminDiv);
  });
}

// Generate BIA recommendation
function generateBIARecommendation(impact) {
  const report = document.getElementById('biaReport');
  if (!report) return;

  if (impact === 'High') {
    report.innerHTML = "🚨 High Impact: Immediate system isolation, notify leadership, launch full-scale forensic analysis.";
  } else if (impact === 'Moderate') {
    report.innerHTML = "⚠️ Moderate Impact: Investigate scope, apply patches, strengthen user awareness.";
  } else {
    report.innerHTML = "✅ Low Impact: Monitor activity, document the event, reinforce minor controls.";
  }
}

// Update incident status (admin)
async function updateStatus(id) {
  const newStatus = document.getElementById(`status-${id}`).value;
  const { error } = await supabase
    .from('incidents')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) alert('Error updating status');
  else {
    alert('Status updated successfully!');
    loadIncidents();
  }
}

// Delete incident (from Reported Incidents only)
async function deleteIncident(id) {
  const confirmDelete = confirm('Are you sure you want to delete this incident?');
  if (!confirmDelete) return;

  const { error } = await supabase
    .from('incidents')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error deleting incident: ' + error.message);
    console.error(error);
  } else {
    alert('Incident deleted successfully.');
    loadIncidents();
  }
}
