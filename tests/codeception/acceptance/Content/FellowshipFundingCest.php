<?php

use Faker\Factory;

/**
 * @group content
 * @group fellowship
 *
 *
 */
class FellowshipFundingCest {

  /**
   * Faker.
   *
   * @var \Faker\Generator
   */
  protected $faker;

  /**
   * Test Constructor
   */
  public function __construct() {
    $this->faker = Factory::create();
  }

  public function testApplicationPage(AcceptanceTester $I) {
//    $button = '<p class="text-align-center"> <a class="su-button su-button--big" href="https://vpgeapps.stanford.edu/app/DIF/auth/"><strong>Apply here!</strong></a>';
    $test_texts = 'this is the song that never ends';
    $node_title = $this->faker->text(20);
    $short_title = $this->faker->text(20);
    $text_area = $I->createEntity([
      'type' => 'stanford_wysiwyg',
      'su_wysiwyg_text' => [
        [
          'value' => "<p>$test_texts</p>",
          'format' => 'stanford_html',
        ],
      ],
    ], 'paragraph');
    $node = $I->createEntity([
      'title' => $node_title,
      'type' => 'fellowship_funding',
      'su_vpge_fellowship_apply_now' => [
        'target_id' => $text_area->id(),
        'target_revision_id' => $text_area->getRevisionId(),
        'text' => $test_texts,
      ],
    ]);
    $I->logInWithRole('custm_vpge_site_manager');
    $I->amOnPage($node->toUrl('edit-form')->toString());
    $I->fillField('Short Title', $short_title);
    $I->click('Save');
    $I->canSee($node_title, 'h1');
    sleep(30);
    $I->canSee($test_texts);

  }

}
