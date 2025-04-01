<?php

use Faker\Factory;

/**
 *
 */
class TeaserCest {

  /**
   * Faker service.
   *
   * @var \Faker\Generator
   */
  protected $faker;

  /**
   * Test constructor.
   */
  public function __construct() {
    $this->faker = Factory::create();
  }

  /**
   *  We need to wait for the JS to load, but we can't do $this->_waitForJS($I, '.form-actions');
   *  with PhpBrowser because it doesn't support JS.
   */
  protected function _waitForJS(AcceptanceTester $I, string $element){
    $found = false;
    $attempts = 10;

    for ($i = 0; $i < $attempts; $i++) {
      try {
        $I->seeElement($element);
        $found = true;
        break;
      } catch (\Exception $e) {
        sleep(1); // Wait 1 second between attempts
      }
    }

    if (!$found) {
      $I->fail("Timed out waiting for $element to appear.");
    }
  }

  /**
   * In VPGE, we override the card display mode with a config split,
   * so this test fails on the stack.
   *
   * @group teaser-headers
   */
  private function testTeaserParagraphHeaders(AcceptanceTester $I) {
    $node_types = \Drupal::entityTypeManager()
      ->getStorage('node_type')
      ->loadMultiple();
    $teaser_entities = [];
    $teaser_item_field = [];
    foreach ($node_types as $node_type) {
      $title_key = $node_type->id() == 'stanford_policy' ? 'su_policy_title' : 'title';
      $teaser_entities[$node_type->id()] = $I->createEntity([
        $title_key => $this->faker->words(3, TRUE),
        'type' => $node_type->id(),
      ]);
      $teaser_item_field[]['target_id'] = $teaser_entities[$node_type->id()]->id();
    }

    $paragraph = $I->createEntity([
      'type' => 'stanford_entity',
      'su_entity_item' => $teaser_item_field,
    ], 'paragraph');
    $node = $I->createEntity([
      'title' => $this->faker->words(3, TRUE),
      'type' => 'stanford_page',
      'su_page_components' => [
        'target_id' => $paragraph->id(),
        'entity' => $paragraph,
      ],
    ]);
    $I->amOnPage($node->toUrl()->toString());
    $I->canSee($node->label(), 'h1');
    foreach ($teaser_entities as $entity) {
      $I->canSee($entity->label(), '.su-entity-item h2');
    }

    $header_text = $this->faker->words(3, TRUE);
    $paragraph = $I->createEntity([
      'type' => 'stanford_entity',
      'su_entity_item' => $teaser_item_field,
      'su_entity_headline' => $header_text,
    ], 'paragraph');
    $node = $I->createEntity([
      'title' => $this->faker->words(3, TRUE),
      'type' => 'stanford_page',
      'su_page_components' => [
        'target_id' => $paragraph->id(),
        'entity' => $paragraph,
      ],
    ]);
    $I->amOnPage($node->toUrl()->toString());
    $I->canSee($node->label(), 'h1');
    $I->canSee($header_text, 'h2');
    foreach ($teaser_entities as $entity) {
      $I->canSee($entity->label(), '.su-entity-item h3');
    }
  }

}
