import Guest from '../models/guestModel.js';

// Get guests by event
export const getGuestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { q } = req.query;

    const query = { eventId };

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phoneNo: regex },
      ];
    }

    const guests = await Guest.find(query).sort({ createdAt: -1 });
    res.json({ success: true, guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Add a guest to event guestlist
export const addGuest = async (req, res) => {
  try {
    const { eventId, name, email, phoneNo } = req.body;
    const guest = new Guest({ eventId, name, email, phoneNo });
    await guest.save();
    res.json({ success: true, guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update RSVP status manually or via link
export const updateRsvp = async (req, res) => {
  try {
    const { guestId, rsvpStatus } = req.body;
    const guest = await Guest.findById(guestId);
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });

    guest.rsvpStatus = rsvpStatus; // 'pending', 'accepted', 'declined'
    await guest.save();

    res.json({ success: true, guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a guest
export const deleteGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const guest = await Guest.findByIdAndDelete(guestId);
    if (!guest) return res.status(404).json({ success: false, message: "Guest not found" });

    res.json({ success: true, message: "Guest deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// (Optional) RSVP via GET links in email (simplified example)
export const rsvpViaLink = async (req, res) => {
  try {
    const { guestId, action } = req.params; // action: accept or decline
    const guest = await Guest.findById(guestId);
    if (!guest) return res.status(404).send('Invalid RSVP link');

    if (action === 'accept') guest.rsvpStatus = 'accepted';
    else if (action === 'decline') guest.rsvpStatus = 'declined';
    else return res.status(400).send('Invalid action');

    await guest.save();
    res.send('RSVP status updated successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};
