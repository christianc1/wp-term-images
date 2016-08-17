/* global i10n_WPTermImages, ajaxurl */
jQuery( document ).ready( function( $ ) {
    'use strict';
	
	/* Globals */
	var wp_term_images_modal;

	/**
	 * Invoke the media modal
	 *
	 * @param {object} event The event
	 */
	$( '#addtag, #edittag, #the-list' ).on( 'click', '.wp-term-images-media', function ( event ) {
		wp_term_images_show_media_modal( this, event );
	} );

	/**
	 * Remove image
	 *
	 * @param {object} event The event
	 */
	$( '#addtag, #edittag, #the-list' ).on( 'click', '.wp-term-images-remove', function ( event ) {
		wp_term_images_reset( this, event );
	} );

	/**
	 * Reset the form on submit.
	 *
	 * Since the form is never *actually* submitted (but instead serialized on
	 * #submit being clicked), we'll have to do the same.
	 *
	 * @see wp-admin/js/tags.js
	 * @link https://core.trac.wordpress.org/ticket/36956
	 *
	 * @param {object} event The event.
	 */
	$( document ).on( 'term-added', function ( event ) {
		wp_term_images_reset( $( '#addtag #submit' ), event );
	} );

	/**
	 * Quick edit interactions
	 */
    $( '#the-list' ).on( 'click', 'a.editinline', function() {
        var tag_id    = $( this ).parents( 'tr' ).attr( 'id' ),
			image     = $( 'td.image img', '#' + tag_id ),
			image_src = image.attr( 'src' ),
			image_id  = image.data( 'attachment-id' );

		if ( typeof( image_id ) !== 'undefined' ) {
			$( 'button.wp-term-images-media' ).hide();
			$( ':input[name="term-image"]', '.inline-edit-row' ).val( image_id );
			$( 'a.button', '.inline-edit-row' ).show();
			$( 'img.wp-term-images-media', '.inline-edit-row' ).attr( 'src', image_src ).show();
		} else {
			$( 'a.button', '.inline-edit-row' ).hide();
			$( ':input[name="term-image"]', '.inline-edit-row' ).val( '' );
			$( 'img.wp-term-images-media', '.inline-edit-row' ).attr( 'src', '' ).hide();
			$( 'button.wp-term-images-media' ).show();
		}
    } );

	/**
	 * Shows media modal, and sets image in placeholder
	 *
	 * @param {type} element
	 * @param {type} event
	 * @returns {void}
	 */
	function wp_term_images_show_media_modal( element, event ) {
		event.preventDefault();

		// Initialize the modal the first time.
		if ( ! wp_term_images_modal ) {
			wp_term_images_modal = wp.media.frames.wp_term_images_modal || wp.media( {
				title:    i10n_WPTermImages.insertMediaTitle,
				button:   { text: i10n_WPTermImages.insertIntoPost },
				library:  { type: 'image' },
				multiple: false
			} );
		}
		// Picking an image, set this Callback to EXECUTE ONCE
		wp_term_images_modal.once( 'select', function () {

			// Get the image URL
			var image = wp_term_images_modal.state().get( 'selection' ).first().toJSON();

			// Get the container
			var $container = $(element).parent();
			console.log($container);

			if ( '' !== image ) {
				if ( ! $( element ).hasClass( 'quick' ) ) {
					$container.find('input').show().val( image.id );
					$container.find( '#wp-term-images-photo' ).attr( 'src', image.url ).show();
					$container.find( '.wp-term-images-remove' ).show();
				} else {
					$( 'button.wp-term-images-media' ).hide();
					$( 'a.button', '.inline-edit-row' ).show();
					$( ':input[name="term-image"]', '.inline-edit-row' ).val( image.id );
					$( 'img.wp-term-images-media', '.inline-edit-row' ).attr( 'src', image.url ).show();
				}
			}
		} );

		// Open the modal
		wp_term_images_modal.open();
	}

	/**
	 * Reset the add-tag form
	 *
	 * @param {element} element
	 * @param {event} event
	 * @returns {void}
	 */
	function wp_term_images_reset( element, event ) {
		event.preventDefault();
		
		// Get the container
		var $container = $(element).parent();

		// Clear image metadata
		if ( ! $( element ).hasClass( 'quick' ) ) {
			$container.find( 'input' ).val( 0 );
			$container.find( '#wp-term-images-photo' ).attr( 'src', '' ).hide();
			$container.find( '.wp-term-images-remove' ).hide();
		} else {
			$( ':input[name="term-image"]', '.inline-edit-row' ).val( '' );
			$( 'img.wp-term-images-media', '.inline-edit-row' ).attr( 'src', '' ).hide();
			$( 'a.button', '.inline-edit-row' ).hide();
			$( 'button.wp-term-images-media' ).show();
		}
	}
} );
