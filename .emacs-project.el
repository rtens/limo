(add-hook 'emacs-startup-hook
          (lambda ()
            (split-window-horizontally -30)
	    (other-window 1)
	    (cd root-directory)
	    (term "npx ava --watch")
	    (other-window 1)
	    )
	  )

