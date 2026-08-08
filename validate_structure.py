"""Validate the revised Synergi homepage content and heading contract."""

from __future__ import annotations

import json
from pathlib import Path

from lxml import html


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "index.html"


def class_xpath(class_name: str) -> str:
    return (
        'contains(concat(" ", normalize-space(@class), " "), '
        f'" {class_name} ")'
    )


def clean_text(node: html.HtmlElement) -> str:
    return " ".join(node.text_content().split())


source = SOURCE.read_text(encoding="utf-8")
document = html.fromstring(source)

local_asset_paths = []
for node in document.xpath("//*[@src or @href]"):
    candidate = node.get("src") or node.get("href")
    if not candidate or candidate.startswith(("http://", "https://", "#", "mailto:")):
        continue
    local_asset_paths.append(candidate)

missing_local_assets = sorted(
    asset for asset in local_asset_paths if not (ROOT / asset).is_file()
)

h1_nodes = document.xpath("//h1")
main_h2 = [clean_text(node) for node in document.xpath("//main//h2")]
service_cards = document.xpath(
    f'//section[@id="services"]//article[{class_xpath("service-card")}]'
)
industry_titles = document.xpath(
    f'//section[{class_xpath("industries-section")}]//h3'
)
industry_cards = document.xpath(
    f'//section[{class_xpath("industries-section")}]'
    f'//article[{class_xpath("industry-card")}]'
)
industry_buttons = document.xpath(
    f'//section[{class_xpath("industries-section")}]//*[@data-industry-go]'
)
industry_images = document.xpath(
    f'//section[{class_xpath("industries-section")}]//img[@src and normalize-space(@alt)]'
)
industry_image_sources = [image.get("src") for image in industry_images]
why_titles = document.xpath(f'//section[{class_xpath("why-section")}]//h3')
partner_links = document.xpath(
    f'//section[{class_xpath("partner-marquee-section")}]'
    f'//div[{class_xpath("partner-marquee-track")}][1]/a'
)
location_titles = document.xpath(
    f'//section[{class_xpath("region-section")}]'
    f'//div[{class_xpath("location-copy")}]/h3'
)
location_functions = document.xpath(
    f'//span[{class_xpath("location-function")}]'
)
main_sections = document.xpath("//main/section")
labelled_main_sections = [
    section
    for section in main_sections
    if section.get("aria-labelledby")
    and document.get_element_by_id(section.get("aria-labelledby"), None) is not None
]

report = {
    "h1_count": len(h1_nodes),
    "h1": clean_text(h1_nodes[0]) if h1_nodes else None,
    "hero_keyword_animation": document.xpath(
        'string(//*[@data-hero-typewords]/@data-hero-typewords)'
    ),
    "hero_accessible_keyword_sentence": document.xpath(
        'normalize-space(string(//p[contains(concat(" ", normalize-space(@class), " "), " hero-motion-line ")]/span[contains(concat(" ", normalize-space(@class), " "), " sr-only ")]))'
    ),
    "main_h2_count": len(main_h2),
    "main_h2": main_h2,
    "main_sections": len(main_sections),
    "labelled_main_sections": len(labelled_main_sections),
    "main_h4_to_h6": len(document.xpath("//main//*[self::h4 or self::h5 or self::h6]")),
    "service_cards": len(service_cards),
    "industry_h3": len(industry_titles),
    "industry_cards": len(industry_cards),
    "industry_controls": len(
        document.xpath(
            '//*[@data-industry-prev or @data-industry-next]'
        )
    ),
    "industry_selection_buttons": len(industry_buttons),
    "industry_images": len(industry_images),
    "industry_unique_images": len(set(industry_image_sources)),
    "industry_active_buttons": sum(
        button.get("aria-pressed") == "true" for button in industry_buttons
    ),
    "industry_live_status": len(document.xpath('//*[@data-industry-status]')),
    "why_h3": len(why_titles),
    "number_sections": sum(
        document.get_element_by_id(element_id, None) is not None
        for element_id in ("scale-title",)
    ),
    "number_source_labels": source.count(
        "Figures reported in the Synergi Company Overview dated 25 June 2026."
    ),
    "partner_links": len(partner_links),
    "partner_links_internal": all(
        link.get("href") == "https://synergi.ae/partners/"
        for link in partner_links
    ),
    "locations": len(location_titles),
    "location_functions": len(location_functions),
    "events_heading": len(document.xpath('//h2[@id="events-title"]')),
    "social_heading": len(document.xpath('//h2[@id="social-title"]')),
    "project_management_capabilities": len(
        document.xpath(
            f'//article[{class_xpath("service-card-project-management")}]//li'
        )
    ),
    "title": document.xpath("string(//title)"),
    "canonical": document.xpath('string(//link[@rel="canonical"]/@href)'),
    "legacy_opening_present": (
        "At Synergi, we deliver reliable BPO services" in source
    ),
    "removed_numbers_option_present": (
        "Synergi in Numbers: An Interactive View" in source
        or "data-synergi-impact-three" in source
    ),
    "removed_needs_section_present": (
        document.get_element_by_id("needs", None) is not None
        or "What does your business need next?" in source
        or "data-need-question" in source
    ),
    "missing_local_assets": missing_local_assets,
}

expected_h1 = "BPO Services in UAE & the Gulf to Power Your Business"
assert report["h1_count"] == 1, report
assert report["h1"] == expected_h1, report
assert report["hero_keyword_animation"] == (
    "manual work,silos,delays,unnecessary overhead"
), report
assert report["hero_accessible_keyword_sentence"] == (
    "Helping your business remove manual work, silos, delays, and unnecessary overhead."
), report
assert report["main_sections"] == report["labelled_main_sections"], report
assert report["main_h4_to_h6"] == 0, report
assert report["service_cards"] == 6, report
assert report["industry_h3"] == 6, report
assert report["industry_cards"] == 6, report
assert report["industry_controls"] == 2, report
assert report["industry_selection_buttons"] == 6, report
assert report["industry_images"] == 6, report
assert report["industry_unique_images"] == 6, report
assert report["industry_active_buttons"] == 1, report
assert report["industry_live_status"] == 1, report
assert report["why_h3"] == 4, report
assert report["number_sections"] == 1, report
assert report["number_source_labels"] == 1, report
assert report["partner_links"] == 9, report
assert report["partner_links_internal"], report
assert report["locations"] == 5, report
assert report["location_functions"] == 5, report
assert report["events_heading"] == 1, report
assert report["social_heading"] == 1, report
assert report["project_management_capabilities"] == 8, report
assert report["canonical"] == "https://synergi.ae/", report
assert not report["legacy_opening_present"], report
assert not report["removed_numbers_option_present"], report
assert not report["removed_needs_section_present"], report
assert not report["missing_local_assets"], report

print(json.dumps(report, ensure_ascii=False, indent=2))
