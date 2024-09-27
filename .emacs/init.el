(defun my-limo-run-tests ()
	"Deletes all other windows and shows tests in side window"
	(interactive)
	(neotree-hide)
	(delete-other-windows)
	(my-split-window-right)
	(other-window 1)
	(if (get-buffer "limo test watch")
			(switch-to-buffer "limo test watch")
		(progn
			(cd (projectile-project-root))
			(my-shell "npx ava --watch")
			(rename-buffer "limo test watch")))
	(with-selected-window (get-buffer-window "limo test watch")
		(setq window-size-fixed t)
		(window-resize (selected-window) (- 20 (window-total-width)) t t))
	(other-window 1))

(global-set-key (kbd "C-x 9") 'my-limo-run-tests)

(defun my-shell (command)
	"Executes the command in a new shell"
	(interactive "P")
	(if (eq system-type 'windows-nt)
			(progn
				(shell)
				(switch-to-buffer "*shell*")
				(goto-char (point-max))
				(insert command)
				(comint-send-input nil t))
		(term command)))

(my-limo-run-tests)
(magit-fetch-all-prune)
