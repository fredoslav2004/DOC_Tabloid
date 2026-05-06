package dk.via.viatab.story;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stories")
public class StoryController {
	private final StoryRepository stories;

	public StoryController(StoryRepository stories) {
		this.stories = stories;
	}

	@GetMapping
	List<Story> all(@RequestParam(required = false) String department) {
		return department == null || department.isBlank()
				? stories.findAllByOrderByIdDesc()
				: stories.findByDepartmentOrderByIdDesc(department);
	}

	@PostMapping
	Story create(@RequestBody Story story) {
		story.setId(null);
		return stories.save(story);
	}

	@PutMapping("/{id}")
	ResponseEntity<Story> update(@PathVariable Long id, @RequestBody Story next) {
		return stories.findById(id)
				.map(story -> {
					story.setDepartment(next.getDepartment());
					story.setTitle(next.getTitle());
					story.setBody(next.getBody());
					return ResponseEntity.ok(stories.save(story));
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	ResponseEntity<Void> delete(@PathVariable Long id) {
		if (!stories.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		stories.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
