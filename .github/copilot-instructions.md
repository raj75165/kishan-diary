# Kishan Diary - Copilot Instructions

## Project Overview
Kishan Diary is a mobile application designed for farmers to track their farm work activities and implements. The app helps farmers maintain a digital diary of their agricultural operations, equipment usage, and farm management tasks.

**Target Users:** Farmers and agricultural workers
**Key Features:** 
- Track daily farm work activities
- Manage farm implements and equipment
- Record agricultural operations and schedules
- Digital diary for farm management

## Technology Stack
The technology stack will be determined as the project evolves. Common choices for mobile farm tracking apps include:
- Mobile development frameworks (React Native, Flutter, or native iOS/Android)
- Backend services for data synchronization
- Local database for offline functionality
- Cloud storage for data backup

## Coding Standards & Conventions

### General Guidelines
- Write clean, maintainable, and well-documented code
- Use descriptive variable and function names that reflect their purpose
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions small and focused on a single responsibility

### Naming Conventions
- Use clear, descriptive names for variables, functions, and classes
- Follow the naming conventions of the chosen framework/language
- Use consistent naming patterns throughout the codebase

### Code Organization
- Maintain a clear and logical file/folder structure
- Group related functionality together
- Separate UI components from business logic
- Keep configuration separate from code

### Comments and Documentation
- Write self-documenting code where possible
- Add comments for complex logic or non-obvious implementations
- Document public APIs and interfaces
- Keep documentation up-to-date with code changes

## Mobile Development Best Practices

### User Experience
- Design for offline-first functionality (farmers may work in areas with poor connectivity)
- Optimize for performance and battery life
- Support various screen sizes and orientations
- Implement intuitive navigation and workflows

### Data Management
- Implement robust local data storage
- Provide data synchronization when online
- Handle data conflicts gracefully
- Ensure data integrity and validation

### Accessibility
- Follow accessibility guidelines for the chosen platform
- Support larger text sizes
- Provide adequate contrast and touch targets
- Consider multilingual support for different farming communities

## Testing & Validation

### Testing Strategy
- Write unit tests for business logic
- Implement integration tests for critical workflows
- Perform manual testing on target devices
- Test offline functionality thoroughly

### Test Coverage
- Aim for good test coverage of core features
- Prioritize testing of data management and synchronization
- Test edge cases and error conditions

## Security & Data Privacy

### Data Protection
- Store sensitive data securely
- Implement proper authentication if multi-user
- Follow platform security best practices
- Encrypt data at rest if storing sensitive information

### Privacy Considerations
- Respect user privacy and data ownership
- Provide clear data usage policies
- Allow users to export/delete their data
- Minimize collection of personal information

## Agricultural Domain Considerations

### Terminology
- Use appropriate agricultural and farming terminology
- Consider regional variations in farming practices
- Support local units of measurement (acres, hectares, etc.)
- Be mindful of different farming contexts (crop farming, livestock, mixed farming)

### Feature Design
- Design features around actual farming workflows
- Consider seasonal variations in farm activities
- Support different types of farm operations
- Allow customization for different farming needs

## Development Workflow

### Version Control
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Create feature branches for new functionality
- Review code before merging

### Code Quality
- Follow linting rules consistently
- Address warnings and deprecations promptly
- Refactor when necessary to maintain code quality
- Keep dependencies up-to-date and secure

## Performance Considerations
- Optimize for mobile device constraints
- Minimize battery usage
- Reduce network data usage
- Implement efficient data storage and retrieval
- Cache data appropriately for offline access

## Future Extensibility
- Design with future features in mind
- Keep code modular and loosely coupled
- Document architectural decisions
- Plan for scalability as user base grows
