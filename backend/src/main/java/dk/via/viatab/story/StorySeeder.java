package dk.via.viatab.story;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class StorySeeder {
	@Bean
	CommandLineRunner seedStories(StoryRepository stories) {
		return args -> {
			if (stories.count() > 0) {
				return;
			}
			stories.saveAll(List.of(
					new Story("ICT", "Robots demand better coffee in C05", "A brave prototype refused to boot until the filter machine was cleaned."),
					new Story("Business", "Spreadsheet predicts Friday before lunch", "Analysts say morale rose 42 percent after the formula was discovered."),
					new Story("Engineering", "Bridge model survives dramatic desk test", "Witnesses report only one ruler and two pencils were lost.")));
		};
	}
}
