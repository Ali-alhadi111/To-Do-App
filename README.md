# To-Do List Mobile App

A beautiful, feature-rich to-do list mobile app built with vanilla HTML, CSS, and JavaScript, following Apple's Human Interface Guidelines design system.

## Features

### ✅ Basic Features
- **Add Tasks**: Create new tasks with text input
- **Delete Tasks**: Remove tasks with a single tap
- **Edit Tasks**: Inline editing by tapping on task text
- **Mark Complete**: Toggle task completion status

### 🎯 Advanced Features
- **Local Storage**: All tasks are automatically saved locally
- **Categories**: Organize tasks into Work, Study, and Personal categories
- **Deadlines**: Set due dates for tasks with visual indicators
- **Notifications**: Browser notifications for task reminders
- **Voice Input**: Add tasks using speech recognition (Web Speech API)
- **Filtering**: Filter tasks by category
- **PWA Support**: Install as a mobile app

### 🎨 Design Features
- **Apple HIG Design**: Follows Apple's Human Interface Guidelines
- **Dark Mode**: Automatic dark mode support
- **Responsive**: Optimized for mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Haptic Feedback**: Vibration feedback on supported devices
- **Smooth Animations**: Delightful micro-interactions

## Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Start using** the app immediately - no installation required!

### For PWA Installation:
1. Open the app in Chrome/Safari on mobile
2. Tap "Add to Home Screen" when prompted
3. The app will install like a native mobile app

## Usage

### Adding Tasks
- Type in the input field and press Enter or tap "Add Task"
- Use the category dropdown to assign a category
- Set a deadline using the date/time picker
- Use voice input by tapping the microphone button

### Voice Commands
- Tap the microphone button to open voice input
- Say "Add [task description]" or just speak the task
- The app will automatically create the task

### Managing Tasks
- **Complete**: Tap the checkbox to mark as done
- **Edit**: Tap on the task text to edit inline
- **Delete**: Tap the trash icon to remove
- **Filter**: Use category buttons to filter tasks

### Notifications
- Grant notification permission when prompted
- Get reminders 1 hour before task deadlines
- Notifications work even when the app is closed

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: ES6+ features, classes, and modern APIs
- **Web Speech API**: Voice recognition for task input
- **Web Notifications API**: Browser notifications
- **Local Storage API**: Persistent data storage
- **Service Worker**: PWA functionality and offline support

### Browser Support
- **Chrome**: Full support including voice input
- **Safari**: Full support (iOS 14.5+ for voice input)
- **Firefox**: Full support except voice input
- **Edge**: Full support including voice input

### Performance
- **Fast Loading**: Optimized CSS and JavaScript
- **Offline Support**: Works without internet connection
- **Low Memory**: Efficient data structures and rendering
- **Smooth Animations**: 60fps animations with hardware acceleration

## File Structure

```
To-Do App/
├── index.html          # Main HTML file
├── styles.css          # Apple HIG inspired styles
├── script.js           # Main application logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md          # This file
```

## Customization

### Adding New Categories
1. Update the category options in `index.html`
2. Add corresponding CSS styles in `styles.css`
3. Update the category filter logic in `script.js`

### Styling
- Modify CSS custom properties in `:root` for colors
- Update spacing, typography, and layout as needed
- All styles follow Apple's design principles

### Features
- Extend the `TodoApp` class in `script.js`
- Add new methods for additional functionality
- Integrate with external APIs or databases

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the app!

---

**Built with ❤️ following Apple's Human Interface Guidelines**

